const express = require('express');
const app = express();
const https = require('https')
const fs = require('fs')
const cors = require('cors')
require('dotenv').config();

// Middleware for converting request to json
const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(cors())

//For connecting to DB
const mongoose = require('mongoose');

//Import routes (middleware)
const postsRoute = require('./routers/posts')

app.use('/posts', postsRoute)
app.use('/specific', postsRoute)

//Homepage get
app.get('/', (req, res) => {
    res.send('<h1>HomePage</h1>');
});

mongoose.connect(
    process.env.DB_url,
    { useNewUrlParser: true },
    () => {
        console.log("connected to DB")
    });

//for listening
// https.createServer({
//     key: fs.readFileSync('server.key'),
//     cert: fs.readFileSync('server.cert')
// }, app)
//     .listen(3015, function () {
//         console.log('listening on port 3015')
//     })
// for killing: fuser -k 8080/tcp
app.listen(3015)