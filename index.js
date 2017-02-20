//strict mode
'use strict'

//Libraries
const http = require('http')
const express = require('express')
const bodyParser = require('body-parser')
const WitMessengerBot = require('./WitMessengerBot')
const {
    manageContext
} = require('./helpers/context');


//actions object to initialize wit instance
const actions = require('./actions')

//intializing a messenger bot instance + a wit.ai instance inside of witMessengerBot
let bot = new WitMessengerBot({
    token: process.env.PAGE_ACCESS_TOKEN,
    verify: process.env.VERIFY_TOKEN
}, {
    accessToken: process.env.WIT_ACCESS_TOKEN,
    actions: actions
})

//debugging
// console.log(JSON.stringify(bot))



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

    //some interaction..
    //let user know the bot has seen the message
    bot.sendSenderAction(senderId, 'mark_seen', function(err, reply) {
        if (err) throw err
    })

    //let user know the bot is typing..
    bot.sendSenderAction(senderId, 'typing_on', function(err, reply) {
        if (err) throw err
    })

    //start or resume a conversaton
    bot.sessionHandler.findOrCreateSession(senderId, function(err, reply) {
        let sessionId = reply
        bot.sessionHandler.read(sessionId, function(err, reply) {
            var context = reply.context
            var senderId = reply.fbid
            //running NLP actions
            bot.runActions(sessionId, text, context, (context) => {
                //TODO: if has error, keep it until it has helpful & error, only then discard.
								console.log("\n\ncontext-before: "+JSON.stringify(context))
								context = manageContext(context)
								console.log("context-after: "+JSON.stringify(context))

								//delete if(empty object), else update.
                if (Object.keys(context).length === 0 && context.constructor === Object)
                    bot.sessionHandler.delete(sessionId)
								else bot.sessionHandler.write(sessionId, {fbid: senderId, context: context})

                //stop typing
                //TODO: do I really need this? Given I reply in all scenarios.
                bot.sendSenderAction(senderId, 'typing_off', function(err, reply) {
                    if (err) throw err
                })
            })
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
    res.end(JSON.stringify({
        status: 'ok'
    }))
})

//creating server locally on port 3000
http.createServer(app).listen(process.env.PORT)
