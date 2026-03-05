const express = require("express");
const WebSocket = require("ws");

const app = express();
app.use(express.json());

app.get("/", (req,res)=>{
  res.send("PDMS API running");
});

app.post("/pdms", async (req,res)=>{

  const token = req.body.token;
  const msg = req.body.msg;

  if(!token || !msg){
    return res.status(400).json({error:"missing token or msg"});
  }

  try{

    const ws = new WebSocket(
      "wss://fids.police.go.th/pdms/api/chat",
      {
        headers:{
          "Origin":"https://fids.police.go.th",
          "User-Agent":"Mozilla/5.0"
        }
      }
    );

    let finished = false;

    const timer = setTimeout(()=>{
      if(!finished){
        finished = true;
        ws.terminate();
        res.status(500).json({error:"timeout"});
      }
    },15000);

    ws.on("open", ()=>{

      ws.send(JSON.stringify({
        token:token,
        msg:msg
      }));

    });

    ws.on("message",(data)=>{

      if(finished) return;

      finished = true;
      clearTimeout(timer);

      try{
        const json = JSON.parse(data.toString());
        res.json(json);
      }catch(e){
        res.json({msg:data.toString()});
      }

      ws.close();

    });

    ws.on("error",(err)=>{

      if(finished) return;

      finished = true;
      clearTimeout(timer);

      res.status(500).json({error:err.toString()});
    });

  }catch(e){

    res.status(500).json({error:e.toString()});

  }

});

const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
  console.log("Server running on port "+PORT);
});
