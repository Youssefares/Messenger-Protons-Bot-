//strict mode
'use strict'

//--------------------------------------------------------------------------------
//Libs & Constants

	const http = require('http')
	const Bot = require('messenger-bot')
	const express = require('express')
	const bodyParser = require('body-parser')

	const config = require('./config')
	const NLProcessor = require('./Processor')

//-------------------------------------------------------------------------------
    //initing the Natural Lang Processor
	let processor = new NLProcessor()
	console.log(JSON.stringify(processor))

//-------------------------------------------------------------------------------
//Messenger Event Handlers via https://github.com/remixz/messenger-bot

	//new bot instance with token
	let bot = new Bot({
		token: config.PAGE_ACCESS_TOKEN,
		verify: 'BOT_VERIFY' //for webhooking the first time
	})

	bot.on('error',(err) => {
		console.log(err.message)
	})

	bot.on('message', (payload, reply) => {
		let text = payload.message.text
	    console.log(text)

	    processor.message(text,{},(data) => {
	    	console.log('Yay, got Wit.ai response')
	    })

	    bot.getProfile(payload.sender.id, (err, profile) => {
	        if (err) throw err
	        
	        console.log(text)
	        reply({ text }, (err) => {
	            if (err){
	            	console.log(JSON.stringify(err))
	            	throw err
	            }


	        console.log(`Echoed back to ${profile.first_name} ${profile.last_name}: ${text}`)
	    })
	  })
	})


//----------------------------------------------------------------------------------
//Facebook Webhook Request Handling

    //express & body parser are here!
	let app = express()

	app.use(bodyParser.json())
	app.use(bodyParser.urlencoded({
	  extended: true
	}))



	//Configing the way the server handles requests
	app.get('/', (req, res) => {
		//when facebook hits this webhook with a GET, return verify token specified in bot instance.
	    return bot._verify(req, res)
	})

	app.post('/', (req, res) => {
	    bot._handleMessage(req.body)
	    res.end(JSON.stringify({status: 'ok'}))
	})

	//creating server locally on port 3000
	http.createServer(app).listen(3000)