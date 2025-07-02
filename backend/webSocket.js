import { v4 as uuidv4} from "uuid"
import { WebSocketServer } from "ws"
import url from "url"
import { Userfile } from "./models/file.model.js"
const handleWs = async (server) => {
    const wsServer = new WebSocketServer({ server })
    const connectionsFile = {}
    const handleMessage = async (message, uuid, fileName) => {
      const parsedMessage = JSON.parse(message.toString())
      // console.log(parsedMessage, uuid, fileName);
  
      connectionsFile[fileName]["message"] = parsedMessage;
      const existedFile = await Userfile.findOne({
        fileName
    })

    // console.log("existed file in handle",existedFile);
    
    existedFile.content=parsedMessage
    await existedFile.save();
      // console.log("connectionAndUser",connectionsFile,Object.keys(connectionsFile[fileName].connections).length);
      Object.keys(connectionsFile[fileName].connections).forEach(key => {
        if (key == uuid) return
        const stringifiedMessage = parsedMessage
        connectionsFile[fileName]?.connections[key].send(JSON.stringify({code:stringifiedMessage,users:Object.keys(connectionsFile[fileName].connections).length}))
  
      })
    }
    const handleClose = (uuid, fileName) => {
      // console.log(`connection closed  ${uuid}`);
  
      delete connectionsFile[fileName].connections[uuid]
      if (Object.keys(connectionsFile[fileName].connections).length === 0) {
        delete connectionsFile[fileName]
      }
  
    }
    wsServer.on("connection",async (connection, request) => {
      const uuid = uuidv4()
      const { fileName } = url.parse(request.url, true).query

      if(!fileName){
        connection.close(1008, "Missing fileName in query string")
        return
      }
        const existedFile = await Userfile.findOne({
              fileName
          }).select("-__v -_id")
        // console.log("existedfile",existedFile);
        if(existedFile && connectionsFile[fileName]){
                
            Object.keys(connectionsFile[fileName].connections).forEach(key => {
            connectionsFile[fileName].connections[key].send(JSON.stringify({code:existedFile.content,users:Object.keys(connectionsFile[fileName].connections).length}))

            })
        }
          if(!existedFile){
            const createUserFile = await Userfile.create({
                fileName,
                content:`${fileName}`
            })
            // console.log("createUserFile",createUserFile);
            
          }
     
  
      connectionsFile[fileName] = { ...connectionsFile[fileName], connections: { ...connectionsFile[fileName]?.connections, [uuid]: connection },message:existedFile?existedFile.content:"" }
     
      connection.on("message", message => handleMessage(message, uuid, fileName))
      connection.on("close", () => handleClose(uuid, fileName))
    })
  }

  export default handleWs