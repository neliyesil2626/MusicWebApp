import express from 'express';
import { GridFSBucket } from 'mongodb';
import bodyParser from 'body-parser';
import { MongoClient, ObjectId } from 'mongodb';
import { Readable} from 'stream';
import multer from 'multer';

const MONGO_URL = 'mongodb://127.0.0.1:27017';
const MONGO_DATABASE = "demo"; // we're using the default test database
const MONGO_LIBRARY = "demolibrary";
const MONGO_PLAYLISTS = "playlists";


let dbClient = null;
const connect = async (url) => {
    let client = await MongoClient.connect(url, {
        directConnection: true,
        appName : "musicapp"
    });    
    return client;
}
/*
 * returns a mongoclient that is connected to the t database. (defined above)
 */
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

const getUserPlayLists = async (uID) => {
    const database = await getConnection();
    var query = {userID: uID};
    const values = await database.collection(MONGO_PLAYLISTS).find(query).toArray();
    return values;
}

const listSongs = async () => {
    const database = await getConnection();
    const values = await database.collection(MONGO_LIBRARY).find({}).toArray();
    return values;
}

//this handler method is from https://medium.com/@richard534/uploading-streaming-audio-using-nodejs-express-mongodb-gridfs-b031a0bcb20f
const streamSong = async (trackNumber, res) => {
    const db = await getConnection(); 
    try {// if tracknumber is an invalid format, this will return the error in the catch
        console.log("tracknumber = " + trackNumber);
        var trackID = new ObjectId(trackNumber);         
    } catch(err) {
        return res.status(400).json({ message: "Invalid trackID in URL parameter. Must be a single String of 12 bytes or a string of 24 hex characters" }); 
    }

    //these two statements set the respective headers of the HTTP GET response
    res.set('content-type', 'audio/mp3'); 
    res.set('accept-ranges', 'bytes');


    //a bucket what gridfs calls the group of collections containing the chunks of a file
    //these two lines open up a stream to the t database and 
    //use it to download the mp3 file
    let bucket = new GridFSBucket(db); 
    let downloadStream = bucket.openDownloadStream(trackID);

    //when a chunk is recieved from mongo this method is called.
    //this method writes that chunk pf data to the HTTP GET response.
    downloadStream.on('data', (chunk) => { 
        res.write(chunk);
    });


    //if there is an error while streaming the bucket, the response status is sent to
    // 404 not found.
    downloadStream.on('error', () => { 
        res.sendStatus(404);
    });

    //once the bucket finishes streaming from the mongodb, the HTTP GET response is ended.
    //res.end() is used to tell the webserver that there are no more chunks to recieve.  
    downloadStream.on('end', () => {
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

    //since the song is being sent to the backend server as formdata, multer is used to
    //process the file inside the form. 
    const storage = multer.memoryStorage()
    const upload = multer({ storage: storage, limits: { fields: 1, fileSize: maxFileSize, files: 1, parts: 2 }});
    
    //since there is only one mp3 file that needs to be uploaded, multer.Single() is used
    // to write and upload the file to the mongodb.
    //multer.single() takes the request, response, and a handler method as parameters
    upload.single('track')(req, res, (err) => {
        if (err) {
          return res.status(400).json({ message: "Upload Request Validation Failed", code: err });
        } else if(!req.body.name) { //if there is no trackname, send back an error
          return res.status(400).json({ message: "No track name in request body" });
        }
        let trackName = req.body.name; //trackname recieved from HTTP GET request

         // readableTrackStream is a readable stream that will be used to communicate with the mongoDB
         // https://stackoverflow.com/questions/38316821/why-can-i-push-into-a-readable-stream
        const readableTrackStream = new Readable();
        readableTrackStream.push(req.file.buffer);
        readableTrackStream.push(null); //done writing data. 

        let bucket = new GridFSBucket(db);
        let uploadStream = bucket.openUploadStream(trackName); //writable buffered stream
        let id = uploadStream.id; //the ObjectID of the track that will be uploaded

        //readableTrackStream.pipe writes the trackfile to the upload stream
        //which uploads the file to the mongodb.
        readableTrackStream.pipe(uploadStream); 

        //if there is an error while uploading the stream to the mongodb, an error code
        //is sent to the mongodb
        uploadStream.on('error', () => {
            console.log("upload failed")
            return res.status(500).json({ message: "Error uploading file" });
        });
      
        //once upload is complete, 201 created success status is sent to mongodb
        //and upload is terminated. 
        uploadStream.on('finish', () => {
            console.log("upload complete")
            return res.status(201).json(id);
        });

    });
}
      
// delete a song from the db
const deleteSong = async (id, name, objectID) => {
    const database = await getConnection();
    let bucket = new GridFSBucket(database);
    
    console.log("Deleting " + id)
    await database.collection(MONGO_LIBRARY).deleteOne({_id: ObjectId(id)});
    await bucket.delete(ObjectId(objectID));  
    console.log("Successfully Deleted "+name);  
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
    await database.collection(MONGO_LIBRARY).insertOne(songRecord);    
}

const editSong = async (name, artist, album, duration, objectID) => {
    const database = await getConnection();
    console.log("connection = "+database);
    var query = {_id: ObjectId(objectID)};
    let song = await database.collection(MONGO_LIBRARY).findOne(query);
    console.log('song = ');
    console.log(song);
    if(song === null){
        console.log("song is of type: "+typeof song)
        return false;
    }

    name = (name === undefined || name === '')? song.name : name;
    artist = (artist === undefined || artist === '')? song.artist : artist;
    album = (album === undefined || album === '')? song.album : album;
    duration = (duration === undefined || duration === '')? song.duration : duration;
    
    var newvalues = { $set: { name: name, artist: artist, album: album, duration: duration} };
    console.log('new song = '); console.log(song);
    await database.collection(MONGO_LIBRARY).updateOne(query, newvalues);
    return true;
}

const createPlaylist = async (name, userID, songs) => {
    const database = await getConnection();
    console.log("connection = "+database);
    const newPlaylist = {
        'name': name,
        'userID': userID,
        'songs': songs
    }
    await database.collection(MONGO_PLAYLISTS).insertOne(newPlaylist);
}

const editPlaylist = async (id, name, songs) => {
    const database = await getConnection();
    console.log("connection = "+database);
    var query = {_id: ObjectId(id)};
    
    var newvalues = { $set: { name: name, songs: songs} };
    console.log('id = ' + ObjectId(id));
    console.log('new name = '+ name);
    console.log('new songs = '); console.log(songs);
    await database.collection(MONGO_PLAYLISTS).updateOne(query, newvalues);
    return true;
}

const deletePlaylist = async (id) => {
    const database = await getConnection();
    console.log("Deleting " + id)
    await database.collection(MONGO_PLAYLISTS).deleteOne({_id: ObjectId(id)});    
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
            const { id, name, objectID } = req.body;
            await deleteSong(id, name, objectID);
            res.status(200).json({ status: "ok"});
        },
    },
    {
        method: 'post',
        path: '/editsong',
        handler: async (req, res) => {
            const { id, name, artist, album, duration} = req.body;
            let status = await editSong(name, artist, album, duration, id);
            res.set({
                'Access-Control-Allow-Origin' : '*', 
                'Access-Control-Allow-Credentials' : true
            });
            if(status)
                res.status(200).json({ status: "ok"});
            else 
                res.status(400).json({status: "not found"});
        }
    },
    {
        method: 'post',
        path: '/createPlaylist',
        handler: async (req, res) => {
            const { name, userID, songs} = req.body;
            await createPlaylist(name, userID, songs);
            res.status(200).json({ status: "ok"});
        },
    },
    {
        method: 'post',
        path: '/editPlaylist',
        handler: async (req, res) => {
            const {id, name, userID, songs} = req.body;
            let status = await editPlaylist(id, name, songs);
            res.set({
                'Access-Control-Allow-Origin' : '*', 
                'Access-Control-Allow-Credentials' : true
            });
            if(status)
                res.status(200).json({ status: "ok"});
            else 
                res.status(400).json({status: "not found"});
        }
    },
    {
        method: 'get',
        path: '/userPlaylists/:userID',
        handler: async (req, res) => {
            const userID = req.params.userID
            let values = await getUserPlayLists(userID);
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
        method: 'post',
        path: '/deleteplaylist',
        handler: async (req, res) => {
            const { _id } = req.body;
            await deletePlaylist(_id);
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
    console.log("binding route: "+route.path )
});

const start = async () => {
    await connect(MONGO_URL);
    app.listen(BACKEND_PORT, () => {
        console.log(`Server is up at port ${BACKEND_PORT}`)
    })
    
}
start(); // setup connection to mongodb and start the server

process.on('SIGINT', () => { console.log("Exiting!"); process.exit(); })