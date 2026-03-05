const express = require("express");
const WebSocket = require("ws");

const app = express();
app.use(express.json());

app.post("/pdms", async (req, res) => {

  const { token, msg } = req.body;

  if (!token || !msg) {
    return res.status(400).json({ error: "missing token or msg" });
  }

  const ws = new WebSocket("wss://fids.police.go.th/pdms/api/chat");

  let replied = false;

  ws.on("open", () => {

    ws.send(JSON.stringify({
      token: token,
      msg: msg
    }));

  });

  ws.on("message", (data) => {

    if (replied) return;
    replied = true;

    try {

      const text = data.toString();

      res.json({
        msg: text
      });

    } catch (err) {

      res.json({
        error: err.toString()
      });

    }

    ws.close();

  });

  ws.on("error", (err) => {

    if (replied) return;
    replied = true;

    res.status(500).json({
      error: err.toString()
    });

  });

});

app.listen(10000, () => {
  console.log("Server running on 10000");
});
