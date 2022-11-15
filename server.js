const express = require('express');
const app = express();
const port = process.env.PORT || 80;
const Rcon = require("rcon");
const bodyParser = require('body-parser')
const cors = require('cors')

const jsonParser = bodyParser.json()
const rawParser = bodyParser.text({type: () => true})


const options = {tcp: true, challenge: false};
const factorio = new Rcon("5.83.173.187", 12350, "1337228", options);
var connected = false;


const CyclicDb = require("cyclic-dynamodb")
const db = CyclicDb("enchanting-rose-robeCyclicDB")

const dataDB = db.collection("data")

app.use(function (req, res, next) {
  res.set('x-timestamp', Date.now())
  res.set('x-powered-by', 'cyclic.sh')
  console.log(`[${new Date().toISOString()}] ${req.ip} ${req.method} ${req.path}`);
  next();
});

var appOptions = {
  dotfiles: 'ignore',
  etag: false,
  extensions: ['htm', 'html','css','js','ico','jpg','jpeg','png','svg'],
  index: ['index.html'],
  maxAge: '1m',
  redirect: false
}

app.use(cors())
app.use(express.static('user-inteface/public', appOptions));

app.use('index/*', (req,res) => {
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

app.get('/research/list', (req,res) => {

  getTechnologies().then((res) => {
    console.log("1")
    console.log(res)
    res.send(getTechnologies());
  })
});

app.get('/resource/list', (req,res) => {
  res.send(getResources());
});

async function setTechnologies(newData) {
  await dataDB.set("technologies", newData)
}

async function setResources(newData) {
  await dataDB.set("resources", newData)
}

async function getTechnologies() {
  await dataDB.get("technologies")
}

async function getResources() {
  await dataDB.get("resources")
}

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
  }).on('response', async function (str) {
    if (str) {

      if (str.researchesInfo) {
        await dataDB.set("technologies", newData)
      } else if (str.resourcesStat) {
        await dataDB.set("resources", newData)
      }
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
