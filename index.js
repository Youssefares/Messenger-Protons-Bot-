//strict mode
'use strict'

//--------------------------------------------------------------------------------
//Libs & Constants

	const http = require('http')
	const Bot = require('messenger-bot')
	const express = require('express')
	const bodyParser = require('body-parser')
	const actions = require('./actions')
	const SessionHandler = require('./SessionHandler')

//-------------------------------------------------------------------------------
    //getting the Natural Lang Processor instanitaed in processor.js with actions from actions.js
	let witMessengerBot = require('./WitMessengerBot').witMessengerBot
	console.log(JSON.stringify(witMessengerBot))

	let sessionHandler = new SessionHandler()

	let bot = witMessengerBot.bot
//-------------------------------------------------------------------------------
//Messenger Event Handlers via https://github.com/remixz/messenger-bot

	bot.on('error',(err) => {
		console.log(err.message)
	})

	bot.on('message', (payload, reply) => {
	   	let text = payload.message.text
			let senderId = payload.sender.id
		  console.log("\n\n---------------------------------\n"+text+"\n")

			//read or create session for this user
			sessionHandler.read(senderId,function(err,reply){

				var context = {}
				//create session if it doesn't exist
				if(reply == null){
					sessionHandler.create(senderId)
				}
				//else deserialize reply JSON string into context object
				else{
					context = JSON.parse(reply)
				}

				//run actions from wit.ai
				witMessengerBot.runActions(senderId, text, context, (context) => {
					if(context == null){
						//if the context objec
						sessionHandler.writeWithExpiration(senderId, JSON.stringify(context))
					}
					sessionHandler.write(senderId, JSON.stringify(context))
		    })

			})
	})


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
	http.createServer(app).listen(process.env.PORT)
