import express from 'express';
import bodyParser from 'body-parser';
import { MongoClient, ObjectId } from 'mongodb';

const MONGO_URL = 'mongodb://127.0.0.1:27017';
const MONGO_DATABASE = "test"; // we're using the default test database

let dbClient = null;
const connect = async (url) => {
    let client = await MongoClient.connect(url, {
        directConnection: true,
        appName : "dogs"
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

// get all dogs in the "dogs" collection
const getAllDogs = async () => {
    const database = await getConnection();
    const values = await database.collection("dogs").find({}).toArray();
    return values;
}

// delete a dog
const deleteDog = async (id) => {
    const database = await getConnection();
    console.log("Deleting " + id)
    await database.collection("dogs").deleteOne({_id: ObjectId(id)});    
}

// add a dog
const addDog = async (name, age, breed, naughty, nice) => {
    const database = await getConnection();
    const dogRecord = {
        "name" : name,
        "age" : age,
        "breed" : breed,
        "naughty": naughty, 
        "nice": nice
    }
    console.log("Adding " + name + ", " + age + ", " + breed)
    await database.collection("dogs").insertOne(dogRecord);    
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
        path: '/dogs',
        handler: async (req, res) => {
            const values = await getAllDogs();
            res.status(200).json(values);
        },
    },
    {
        method: 'post',
        path: '/adddog',
        handler: async (req, res) => {
            const { name, age, breed, naughty, nice } = req.body;
            await addDog(name, age, breed, naughty, nice);
            res.status(200).json({ status: "ok"});
        },
    },
    {
        method: 'post',
        path: '/deletedog',
        handler: async (req, res) => {
            const { _id } = req.body;
            await deleteDog(_id);
            res.status(200).json({ status: "ok"});
        },
    },
];

const BACKEND_PORT = 8000;
const app  = express();
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