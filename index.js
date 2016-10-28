//strict mode
'use strict'

//--------------------------------------------------------------------------------
//Libs & Constants

	const http = require('http')
	const Bot = require('messenger-bot')
	const express = require('express')
	const bodyParser = require('body-parser')
	const actions = require('./actions')

//-------------------------------------------------------------------------------
    //initing the Natural Lang Processor with actions from actions.js
	let processor = require('./Processor').processor
	console.log(JSON.stringify(processor))

	let bot = processor.bot
//-------------------------------------------------------------------------------
//Messenger Event Handlers via https://github.com/remixz/messenger-bot

	bot.on('error',(err) => {
		console.log(err.message)
	})

	bot.on('message', (payload, reply) => {
		let text = payload.message.text
	    console.log(text)

	    //TODO: store context somewhere for third argument
	    processor.runActions(payload.sender.id, text, {},(context) => {
	    	console.log(context)
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