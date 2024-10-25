import express from 'express'
import "dotenv/config.js"
import cors from 'cors'
import morgan from 'morgan'
import { connectMongo } from './src/config/connectMongo.js'
import UserRouter from './src/router/userRouter.js'

const app = express()

app.use(cors())
connectMongo()

const port  = process.env.PORT || 8000

if(process.env.NODE.ENV !== "production"){
    app.use(morgan("dev"))
}
  
app.use(express.json())

app.use('/api/v1/users', UserRouter )


app.listen(port, (error) => {
    error ? console.log(error) : console.log("server running in port ", port);
  });