import express from "express"
import cors from "cors"
import dotEnv from "dotenv" 
import router from "./routes"
dotEnv.config()

const app = express()

app.use(express.json())
app.use(cors())
app.use(router)

app.listen(process.env.SERVER_PORT, ()=>{
	console.log(`servidor rodando na porta ${process.env.SERVER_PORT}`)
})