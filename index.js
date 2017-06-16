//strict mode
'use strict'

//Libraries
const http = require('http')
const express = require('express')
const bodyParser = require('body-parser')
const {WitMessengerBot, BotSessionsDelegate} = require('wit-messenger-bot')

//Helpers
const {manageContext} = require('./helpers/context');
const {actHuman} = require('./helpers/act-human');

//load environment vars
require('dotenv').load();


//actions object to initialize wit instance
const actions = require('./actions')

//intializing a messenger bot instance + a wit.ai instance inside of witMessengerBot
let bot = new WitMessengerBot({
    token: process.env.PAGE_ACCESS_TOKEN,
    verify: process.env.VERIFY_TOKEN
}, {
    accessToken: process.env.WIT_ACCESS_TOKEN,
    actions: actions
}, new BotSessionsDelegate())



/* _______________________________________________________
 * listening on messages
 */

bot.on('error', (err) => {
    console.log("botError: "+err.message)
})

bot.on('message', (payload, reply) => {
    let text = payload.message.text
    let senderId = payload.sender.id
    console.log("\n\n---------------------------------\n" + text + "\n")
    let {sessionId, sessionData} = bot.findOrCreateSession(senderId)
    let context = JSON.parse(sessionData)


    //some interaction..
    actHuman(bot, senderId)

    bot.runActions(sessionId, text, context, (context) => {
      //conversation context logic
      console.log("\n\ncontext-before: "+JSON.stringify(context))
      context = manageContext(context)
      console.log("context-after: "+JSON.stringify(context))

      //delete if(empty object), else update.
      if (Object.keys(context).length === 0 && context.constructor === Object){
        bot.deleteSession(sessionId)
      }
      else bot.writeSession(sessionId, JSON.stringify(context))

    }).catch(function(error){
      if(error.message == 'Intent Undefined'){
        let recipientId = bot.fbIdForSession(sessionId)
				bot.sendMessage(recipientId,{text: "😵 I didn't get that, but I get smarter each message."},(err,info)=> {
					if(err) console.log(err)
				})
			}
      else{
  			console.log(error)
        //stop typing
        bot.sendSenderAction(senderId, 'typing_off', function(err, reply) {
            if (err) throw err
        })
      }
		})
})


bot.on('postback', function(payload, reply, actions){
  let senderId = payload.sender.id
  actHuman(bot, senderId)
  var payload = payload['postback']['payload']
  if(payload == "GET_STARTED_PAYLOAD"){
    var onboardingMsgs = require('./JSON-data/onboarding.json')
    reply(onboardingMsgs['msg1'])
    actHuman(bot, senderId)
    reply(onboardingMsgs['msg2'])
  }
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
    res.end(JSON.stringify({
        status: 'ok'
    }))
})

//creating server locally on port 3000
http.createServer(app).listen(process.env.PORT)
