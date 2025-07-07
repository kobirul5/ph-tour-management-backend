import express, { Request, Response } from 'express'
import {Server} from 'http'
import mongoose from 'mongoose';

let server: Server ;

const app = express()

const starSever = async()=>{
    try {
        await mongoose.connect("mongodb+srv://libraryManagementDB:5guPN4JmSRiEr3Nm@cluster0.dgvjh.mongodb.net/tour-management-DB?retryWrites=true&w=majority&appName=Cluster0")
        console.log("connected to DB")

        server = app.listen(5000, ()=>{
            console.log("server is running on port 5000")
        });

    } catch (error) {
        console.log(error)
    }
}

starSever()

app.get('/', (req:Request, res:Response)=>{
    res.status(200).json({
        massage:"Welcome to tour management system backend"
    })
})