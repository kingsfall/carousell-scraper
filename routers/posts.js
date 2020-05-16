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
        postToDB.save();
        const spawn = require('child_process').spawn;
        var process = spawn('/usr/bin/python3', 
                            ['child-process-carousell-scraper.py',
                            req.body.searchParameter,
                            req.body.keyword]);
        process.stdout.on('data', (data) => {

            // data = JSON.parse(data.toString())
            data = data.toString();
            console.log(data);
            res.json(data);
        })
    }
    catch(err) {
        res.json({message: err});
    }
});

module.exports = router; 