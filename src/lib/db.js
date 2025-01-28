import { MongoClient } from "mongodb";
import { MONGODB_URI } from "$env/static/private";

let client;

export async function connectToDB() {
    if (!client) {
        const uri = MONGODB_URI
        client = new MongoClient(uri);
        await client.connect();
        console.log('Connected to MongoDB');
    }
    return client.db('mydb');
}