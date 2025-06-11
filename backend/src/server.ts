import server from './app';
import dotenv from 'dotenv'
import connectDb from './config/db'

dotenv.config()

const PORT = process.env.PORT;


connectDb()

server.listen(PORT, ()=> {
    console.log(`Server connect to port ${PORT}`)
})