const express = require("express")
const WebSocket = require("ws")

const app = express()
app.use(express.json())

app.get("/", (req,res)=>{
  res.send("PDMS API running")
})

app.post("/pdms", async (req,res)=>{

  try{

    const token = req.body.token
    const msg = req.body.msg

    if(!token || !msg){
      return res.status(400).json({error:"missing token or msg"})
    }

    const ws = new WebSocket("wss://fids.police.go.th/pdms/api/chat",{
      headers:{
        "Origin":"https://fids.police.go.th"
      }
    })

    ws.on("open",()=>{
      ws.send(JSON.stringify({
        token:token,
        msg:msg
      }))
    })

    ws.on("message",(data)=>{
      try{
        const json = JSON.parse(data.toString())
        res.json(json)
      }catch(e){
        res.json({raw:data.toString()})
      }
      ws.close()
    })

    ws.on("error",(err)=>{
      res.status(500).json({error:err.toString()})
    })

    setTimeout(()=>{
      res.status(500).json({error:"timeout"})
      ws.close()
    },8000)

  }catch(e){
    res.status(500).json({error:e.toString()})
  }

})

const port = process.env.PORT || 3000
app.listen(port,()=>{
  console.log("Server running on "+port)
})
