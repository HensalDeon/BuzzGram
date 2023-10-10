import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

async function connect() {

    mongoose.set('strictQuery', true)
    const db = await mongoose.connect(process.env.URI, {
        useNewUrlParser: true,
    });
    console.log("Connected to MongoDB");
    return db;
}

export default connect;
