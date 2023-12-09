import * as redis from "redis"

const client = redis.createClient()

async function conectar(){
	await client.connect()
	client.on("error",err =>{
		console.log("Erro: "+err)
	})
	console.log("Conectado com o Redis")
}

conectar()

export default client
