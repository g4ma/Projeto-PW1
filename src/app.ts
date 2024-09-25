import express from "express"
import cors from "cors"
import dotEnv from "dotenv" 
import router from "./routes"
import path from "path"
dotEnv.config()

const app = express()

app.use(express.json())
app.use(cors())
app.use(router)
app.use("/pics", express.static(path.join(__dirname, "..", "pictures")))

app.listen(process.env.SERVER_PORT, ()=>{
	console.log(`servidor rodando na porta ${process.env.SERVER_PORT}`)
})