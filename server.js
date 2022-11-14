const express = require('express');
const app = express();
const port = process.env.PORT || 80;
const path = require('path');
const Rcon = require("rcon");
const WebSocket = require('ws');
const bodyParser = require('body-parser')
const cors = require('cors')

const wss = new WebSocket.Server({ port: 7071 });
const jsonParser = bodyParser.json()
const rawParser = bodyParser.text({type: () => true})

const clients = new Map();
const options = {tcp: true, challenge: false};
const factorio = new Rcon("5.83.173.187", 12350, "1337228", options);
var connected = false;

wss.on('connection', (ws) => {
  clients.set(ws, {});

  ws.on("close", () => {
    clients.delete(ws);
  });
})

var appOptions = {
  dotfiles: 'ignore',
  etag: false,
  extensions: ['htm', 'html','css','js','ico','jpg','jpeg','png','svg'],
  index: ['index.html'],
  maxAge: '1m',
  redirect: false
}

app.use(cors())
app.use(express.static('public', appOptions));


app.use('*', (req,res) => {
  res.json({
    at: new Date().toISOString(),
    method: req.method,
    hostname: req.hostname,
    ip: req.ip,
    query: req.query,
    headers: req.headers,
    cookies: req.cookies,
    params: req.params
  })
    .end()
})

app.post('/research/start', rawParser,(req,res) => {
  let command = "/startResearch "+ JSON.stringify({technology: req.body});
  factorio.send(command)

  res.send({message: "researching started"});
});

app.post('/research/remove', rawParser,(req,res) => {
  let command = "/removeResearch "+JSON.stringify({technology: req.body});
  factorio.send(command)

  res.send({message: "researching removed"});
});

app.listen(port, () => {
  console.log(`App launched on port ${port}`)

  factorio.on('auth', function() {
    console.log("Factorio authenticated");
    connected = true;
    setInterval(()=> {
      factorio.send("/getResearchesInfo");
    }, 250)
    setInterval(()=> {
      factorio.send("/getResourcesInfo");
    }, 250)
  }).on('response', function(str) {
    if (str) {
      [...clients.keys()].forEach((client) => {
        client.send(str);
      });
    }
  }).on('error', function(err) {
    console.log("Factorio error: " + err);
  }).on('end', function() {
    console.log("Factorio connection closed");
    connected = false;
    process.exit();
  });

  factorio.connect();
});
