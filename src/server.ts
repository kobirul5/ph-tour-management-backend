/* eslint-disable no-console */
import {Server} from 'http'
import mongoose from 'mongoose';
import 'dotenv/config'
import { app } from './app';
let server: Server ;



const starSever = async()=>{
    try {
        await mongoose.connect(`mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.dgvjh.mongodb.net/tour-management-DB?retryWrites=true&w=majority&appName=Cluster0`)
        console.log("connected to DB")

        server = app.listen(5000, ()=>{
            console.log("server is running on port 5000")
        });

    } catch (error) {
        console.log(error)
    }
}

starSever()

process.on("unhandledRejection", (err)=>{
    console.log("Unhandled Rejection Detected... Server Shutting down", err)

    if(server){
        server.close(()=>{
            process.exit(1)
        })
    }
    process.exit(1)
})
process.on("uncaughtException", (err)=>{
    console.log("Uncaught Exception Detected... Server Shutting down", err)

    if(server){
        server.close(()=>{
            process.exit(1)
        })
    }
    process.exit(1)
})


process.on("SIGINT", (err)=>{
    console.log("SIGTERM Detected... Server Shutting down", err)

    if(server){
        server.close(()=>{
            process.exit(1)
        })
    }
    process.exit(1)
})
process.on("SIGINT", (err)=>{
    console.log("SIGINT Detected... Server Shutting down", err)

    if(server){
        server.close(()=>{
            process.exit(1)
        })
    }
    process.exit(1)
})

// Promise.reject(new Error("I forgot to catch this Promise"))

// throw new Error(" I forgot this local error")




