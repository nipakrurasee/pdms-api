import express from "express"
import WebSocket from "ws"

const app = express()
app.use(express.json())

app.post("/pdms", async (req,res)=>{

  const token = req.body.token
  const msg = req.body.msg

  try{

    const ws = new WebSocket("wss://fids.police.go.th/pdms/api/chat")

    ws.on("open",()=>{
      ws.send(JSON.stringify({
        token: token,
        msg: msg
      }))
    })

    ws.on("message",(data)=>{
      res.send(data.toString())
      ws.close()
    })

    ws.on("error",(err)=>{
      res.status(500).send({error:String(err)})
    })

  }catch(e){
    res.status(500).send({error:String(e)})
  }

})

app.get("/",(req,res)=>{
  res.send("PDMS API RUNNING")
})

app.listen(3000,()=>{
  console.log("server start")
})
