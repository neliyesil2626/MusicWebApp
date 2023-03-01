import express from 'express';
import mongodb, { GridFSBucket } from 'mongodb';
import bodyParser from 'body-parser';
import { MongoClient, ObjectId } from 'mongodb';
import { Readable} from 'stream';
import multer from 'multer';
import {Router} from 'express';
//import {Grid} from 'gridfs-stream';

const MONGO_URL = 'mongodb://127.0.0.1:27017';
const MONGO_DATABASE = "t"; // we're using the default test database


let dbClient = null;
const connect = async (url) => {
    let client = await MongoClient.connect(url, {
        directConnection: true,
        appName : "musicapp"
    });    
    return client;
}

const getConnection = async () => {
    if (!dbClient) {
        dbClient = await connect(MONGO_URL);
        if (!dbClient) {
            console.log("Failed to connect to mongodb");
            process.exit(1);
        }
    }
    return dbClient.db(MONGO_DATABASE);
}

// returns every song in  the database
const getAllSongs = async () => {
    const database = await getConnection();
    const values = await database.collection("fs.files").find({}).toArray();
    return values;
}

const listSongs = async () => {
    const database = await getConnection();
    const values = await database.collection("library").find({}).toArray();
    return values;
}

//this handler method is from https://medium.com/@richard534/uploading-streaming-audio-using-nodejs-express-mongodb-gridfs-b031a0bcb20f
const streamSong = async (trackNumber, res) => {
    const db = await getConnection();
    try {
        console.log("tracknumber = " + trackNumber);
        var trackID = new ObjectId(trackNumber);
        
    } catch(err) {
        return res.status(400).json({ message: "Invalid trackID in URL parameter. Must be a single String of 12 bytes or a string of 24 hex characters" }); 
    }

    res.set('content-type', 'audio/mp3');
    res.set('accept-ranges', 'bytes');

    let bucket = new GridFSBucket(db);
    let downloadStream = bucket.openDownloadStream(trackID);

    downloadStream.on('data', (chunk) => { //when a chunk is recieved from mongo
        res.write(chunk);
    });

    downloadStream.on('error', () => { //when an error occurs
        res.sendStatus(404);
    });

    downloadStream.on('end', () => { //when data transfer terminates
        res.end();
    });
}

/* I got this handler method from 
 * https://medium.com/@richard534/uploading-streaming-audio-using-nodejs-express-mongodb-gridfs-b031a0bcb20f
 */
const uploadSong = async (req, res) => {
    /* I used this tool to calculate maxFileSize: https://www.colincrawley.com/audio-file-size-calculator/
     * duration 10 minutes, sample rate = 44.1 khz, bit depth = 32-bit, channels = stereo, bitrate = 128kbps
     */
    let maxFileSize = 211.68 * 1000000; 
    console.log("uploading song: "+req.body.name)
    const db = await getConnection();
    const storage = multer.memoryStorage()
    const upload = multer({ storage: storage, limits: { fields: 1, fileSize: maxFileSize, files: 1, parts: 2 }});
    upload.single('track')(req, res, (err) => {
        if (err) {
          return res.status(400).json({ message: "Upload Request Validation Failed", code: err });
        } else if(!req.body.name) {
          return res.status(400).json({ message: "No track name in request body" });
        }
        let trackName = req.body.name;

         // Covert buffer to Readable Stream
        const readableTrackStream = new Readable();
        readableTrackStream.push(req.file.buffer);
        readableTrackStream.push(null);

        let bucket = new GridFSBucket(db);
        let uploadStream = bucket.openUploadStream(trackName); //writable buffered stream
        let id = uploadStream.id; //the ObjectID of the track that was just uploaded

        //pipe pushes file to stream. 
        readableTrackStream.pipe(uploadStream); 
        uploadStream.on('error', () => {
            console.log("upload failed")
            return res.status(500).json({ message: "Error uploading file" });
        });
      
        uploadStream.on('finish', () => {
            console.log("upload complete")
            return res.status(201).json(id);
        });

    });
}
      
// delete a song from the db
const deleteSong = async (id) => {
    const database = await getConnection();
    console.log("Deleting " + id)
    await database.collection("t").deleteOne({_id: ObjectId(id)});    
}

// add a song to the db
const addSong = async (name, artist, album, duration, objectID) => {
    const database = await getConnection();
    console.log("connection = "+database);
    const songRecord = {
        "name" : name,
        "artist" : artist,
        "album" : album,
        "duration" : duration,
        "objectID" : objectID
    }
    console.log("Adding " + name + ", " + artist + ", " + album +","+ duration +","+ objectID)
    await database.collection("library").insertOne(songRecord);    
}

// these are the routes for the backend APIs
const routes = [
    {
        method: 'get',
        path: '/',
        handler: async (req, res) => {
            res.send(`Backend server is running, listening at port: ${BACKEND_PORT}\n`);
        },
    },
    {
        method: 'get',
        path: '/library',
        handler: async (req, res) => {
            const values = await listSongs();
            console.log(values)
            res.set({
                "Content-Type": "application/json",
                'Access-Control-Allow-Origin' : '*', 
                'Access-Control-Allow-Credentials' : true
            });
            res.status(200).json(values);
        },
    },
    {
        method: 'get',
        path: '/stream/:trackID',
        handler: async (req, res) => {
            //http://127.0.0.1:8000/stream/?trackID=63e28b8b5b61c495598703a8
            //const trackNumber = req.query.trackID;
            const trackNumber = req.params.trackID
            await streamSong(trackNumber, res);
        }
    },
    {
        method: 'post',
        path: '/addsong',
        handler: async (req, res) => {
            const { name, artist, album, duration, objectID} = req.body;
            await addSong(name, artist, album, duration, objectID);
            res.status(200).json({ status: "ok"});
        },
    },
    {
        method: 'post',
        path: '/uploadsong',
        handler: async (req, res) => {
            await uploadSong(req, res);
        },
    },
    {
        method: 'post',
        path: '/deletesong',
        handler: async (req, res) => {
            const { _id } = req.body;
            await deleteSong(_id);
            res.status(200).json({ status: "ok"});
        },
    },
];

const BACKEND_PORT = 8000;
const app = express();
app.use(bodyParser.json());

// setup the routes
routes.forEach(route => {
    app[route.method](route.path, route.handler);
});

const start = async () => {
    await connect(MONGO_URL);
    app.listen(BACKEND_PORT, () => {
        console.log(`Server is up at port ${BACKEND_PORT}`)
    })
    
}
start(); // setup connection to mongodb and start the server

process.on('SIGINT', () => { console.log("Exiting!"); process.exit(); })