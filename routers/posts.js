const express = require('express');
const router = express.Router();
const postSchema = require('../models/post-schema')
const WebSocket = require('ws');


//For routing
// router.get('/',(req,res)=> {
//     res.send('<h1>Posts</h1>');
// });

router.get('/',async(req,res)=> {
    
    try {
        const fromMongoDB = await postSchema.find() 
        res.json(fromMongoDB)
    } catch (err) {
        res.json({message: error})
    }

});

router.post('/', async (req,res) => {

    const postToDB = new postSchema({
        searchParameter: req.body.searchParameter,
        keyword: req.body.keyword
    });

    try {
        await postToDB.save();

        res.json(postToDB);
    }
    catch(err) {
        res.json({message: err})
    }
    var workerSocket = new WebSocket("ws://192.168.1.103:8082");
    workerSocket.onopen = (event) => {
        let message = event.data
        console.log(message)
    }
    // Listen for messages
    workerSocket.addEventListener('message', function (event) {
    console.log('Message from server ', event.data);
});
    workerSocket.onerror = (event) => {
        let error = event.error
        console.log("error has ocurred", error)
    }

    
    

});
module.exports = router; 