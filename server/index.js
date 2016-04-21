// Main starting point of the application
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express(); // Luo express app
const router = require('./router');
const mongoose = require('mongoose');
const cors = require('cors');
// DB Setup
mongoose.connect('mongodb://localhost:auth/auth');

//App Setup --> morgan and bodyParser are middleware in express. Middleware in express is something that incoming request is passed to. So any incoming request is passed to morgan and bodyParser. app.use will register them as a middleware.
app.use(morgan('combined')); //Morgan is a logging framework and we use it basically for debugging.
app.use(cors()); // Cors is a middleware that lets throw submits from addresses to bypass "cors error". You can restrict access to specific domain by specifying the domain address to cors method.
app.use(bodyParser.json({ type: '*/*' })); // bodyParser is a middleware that is used to parse incoming request. Specifically it will parse requests to json. '*/*' --> means it will parse to json no matter what type the request is. <-- Will work for now but will be problem if transfer for example a file.
router(app);

//Server Setup
const port = process.env.PORT || 3090; // Jos on jokin määrätty portti käytä sitä, muuten porttia 3090
const server = http.createServer(app); //Luo http-serveri
server.listen(port); // Serveri kuuntelee porttia joka määrättin aiemmin
console.log('Server listening on:', port);



//Huomioita:
// Voidaan ajaa mongoDB komennolla mongod, jolloin tietokanta käynnistyy
// MongoDB tallentaa/toimii polussa /data/db/