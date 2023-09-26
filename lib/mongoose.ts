import mongoose from "mongoose"

let isConnected = false //check mongoose is connected or not

export const connectToDb = async()=>{
mongoose.set('strictQuery', true)

if(!process.env.MONGODB_URL) return console.log("MONGODB_URL not found")
if(isConnected) return console.log("Already connected to MongoDB")

try {
   await mongoose.connect(process.env.MONGODB_URL)
 isConnected = true

} catch (error) {
    console.log(error)
}

}