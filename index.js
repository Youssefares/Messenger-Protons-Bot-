//strict mode
'use strict'

//Libraries
const http = require('http')
const express = require('express')
const bodyParser = require('body-parser')
const WitMessengerBot = require('./WitMessengerBot')
const {findOrCreateSession, sessions} = require('./sessions')


//actions object to initialize wit instance
const actions = require('./actions')

//intializing a messenger bot instance + a wit.ai instance inside of witMessengerBot
let bot = new WitMessengerBot({
	token: process.env.PAGE_ACCESS_TOKEN,
	verify: process.env.VERIFY_TOKEN
},{
	accessToken: process.env.WIT_ACCESS_TOKEN,
	actions: actions
})

//debugging
// console.log(JSON.stringify(bot))



/* _______________________________________________________
 * listening on messages
 */

bot.on('error',(err) => {
	console.log(err.message)
})

bot.on('message', (payload, reply) => {
   	let text = payload.message.text
		let senderId = payload.sender.id
	  console.log("\n\n---------------------------------\n"+text+"\n")

		//some interaction..
		//let user know the bot has seen the message
		bot.sendSenderAction(senderId, 'mark_seen',function(err,reply){
			if(err) throw err
		})

		//let user know the bot is typing..
		bot.sendSenderAction(senderId, 'typing_on',function(err,reply){
			if(err) throw err
		})

		//gettingContext
		var context = {}
		const sessionId = new Date().toISOString()
		const sessionData = {fbid: senderId, context: {}}
		bot.sessionHandler.write(sessionId, sessionData)

    //running NLP actions
		bot.runActions(sessionId, text, context, (context) => {
			//TODO: if has error, keep it until it has helpful & error, only then discard.
			bot.sessionHandler.delete(sessionId)

			//stop typing
			//TODO: do I really need this? Given I reply in all scenarios.
			bot.sendSenderAction(senderId, 'typing_off',function(err,reply){
				if(err) throw err
			})
		})


		// //read or create session for this user
		// sessionHandler.read(senderId,function(err,reply){
		//
		// 	var context = {}
		// 	//create session if it doesn't exist
		// 	if(reply == null){
		// 		sessionHandler.create(senderId)
		// 	}
		// 	//else deserialize reply JSON string into context object
		// 	else{
		// 		context = JSON.parse(reply)
		// 	}
		//
		// 	//run actions from wit.ai
		// 	bot.runActions(senderId, text, context, (context) => {
		// 		//if the context object is empty, write & set an expiration time on it
		// 		if(Object.keys(context).length === 0){
		// 			console.log("writing with expiration")
		// 			sessionHandler.writeWithExpiration(senderId, JSON.stringify(context))
		// 		}
		// 		//else if not empty, just write it
		// 		else{
		// 			console.log("writing without expiration")
		// 	  	sessionHandler.write(senderId, JSON.stringify(context))
		//    	}
		//
		//
	  //   })
		// })
})

/*_______________________________________________________
 * setting up http-request-handling
 */

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
