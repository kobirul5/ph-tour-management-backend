import express, { Request, Response } from 'express'
export const app = express()

app.get('/', (req:Request, res:Response)=>{
    res.status(200).json({
        massage:"Welcome to tour management system backend"
    })
})