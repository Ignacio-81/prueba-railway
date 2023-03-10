import mongoose from "mongoose";
//import { configObject } from "./index.js";

export async function mongoConnect() {
    try {
        const URL = "mongodb+srv://IBadella:yR6NsdkTtzIObQcF@nachocluster.ytxqvsv.mongodb.net/?retryWrites=true&w=majority"
        let res = await mongoose.connect(URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB connected');
    } catch (e) {
        throw new Error(`Error while connecting to Mongo DB ${e}`)
    }
}

