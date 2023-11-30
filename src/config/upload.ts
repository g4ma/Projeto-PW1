import crypto from "node:crypto"
import multer from "multer"
import {resolve} from "node:path"

const fileHash = crypto.randomBytes(16).toString("hex")

export default {
	upload(folder:string){
		return {
			storage: multer.diskStorage({
				destination: resolve(__dirname,"..","..",folder),
				filename:(request,file,callback) =>{
					const filename = `${fileHash}-${file.originalname}`

					return callback(null,filename)
				},
			}),
		}
	},
}