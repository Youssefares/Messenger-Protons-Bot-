//strict mode
'use strict'

//Libraries
const http = require('http')
const express = require('express')
const bodyParser = require('body-parser')
const SessionHandler = require('./SessionHandler')
const WitMessengerBot = require('./WitMessengerBot')


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
console.log(JSON.stringify(bot))

//initializing sessionHandling (currently with: redis)
let sessionHandler = new SessionHandler()

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
			bot.runActions(senderId, text, context, (context) => {
				if(context == null){
					//if the context object is empty, write & set an expiration time on it
					//TODO: get the expiration to actually work
					sessionHandler.writeWithExpiration(senderId, JSON.stringify(context))
				}
				//else just write
				sessionHandler.write(senderId, JSON.stringify(context))
	    })

		})
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
