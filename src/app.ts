import express, { Request, Response } from 'express'
import cors from 'cors'
import { router } from './app/routes'
import './app/config/passport'
import { globalErrorHandler } from './middlewares/globalErrorHandler'
import notFound from './middlewares/notFound'
import cookieParser from "cookie-parser"
import passport from 'passport';
import expressSession from 'express-session'

export const app = express()

app.use(expressSession({
    secret: "your Secret",
    resave: false,
    saveUninitialized: false
    
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(cookieParser())
app.use(express.json())
app.use(cors())

app.use("/api/v1", router)


app.get('/', (req:Request, res:Response)=>{
    res.status(200).json({
        massage:"Welcome to tour management system backend"
    })
})

app.use(globalErrorHandler)
app.use(notFound)