import mongoose from "mongoose"

export const connectDB = async () => {
    try{
        // //console.log("MONGO_URI:", process.env.MONGO_URI);
        
      await mongoose.connect(process.env.MONGO_URI);
      //console.log("MongoDB Connected Successfully!")  
    } catch (error){
        console.error("Error connecting to MongoDB", error);
        process.exit(1); // exit with failure
    }
};