import mongoose from "mongoose";

const connectDb = async()=>{
    try {
        
        await mongoose.connect(process.env.MONGO_URL, {
            dbName: "pinterest"
        })
        console.log("Db connected successfully")
    } catch (error) {
        console.log("Error in Db", error)
    }
}

export default connectDb;