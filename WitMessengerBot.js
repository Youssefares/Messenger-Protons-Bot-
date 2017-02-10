'use strict'
const {Wit, log} = require('node-wit')
const Bot = require('messenger-bot')
const {formatQuickReplies} = require('./fb-formatter')
const {sessions} = require('./sessions');
const SessionHandler = require('./SessionHandler')

//extends Bot from https://github.com/remixz/messenger-bot
//has wit.ai NLP functionality + messenger's SEND api.
class WitMessengerBot extends Bot{
	constructor(fbOptions, witOptions){
		super(fbOptions)

		//add the default send function as a function that calls the method: this.send
		witOptions.actions['send'] = (request, response) =>{
			return this.send(request, response)
		}

		//getting wit app instance with the actions defined
		this.witInstance = new Wit({
	    	accessToken: witOptions.accessToken,
				actions: witOptions.actions,
	    	logger: new log.Logger(log.DEBUG)
    })

		//initializing sessionHandling (currently with: redis)
		this.sessionHandler = new SessionHandler()
	}

	//run actions of the wit.ai instance
	runActions(sessionId, text, context, completionHandler){
		var witMessengerBot = this
		this.witInstance.runActions(sessionId,text,context).then(completionHandler).catch(function(error){
			console.log(error.message)
			if(error.message == 'Intent Undefined'){
				  witMessengerBot.sessionHandler.read(sessionId, function(err,reply){
					const sessionData = JSON.parse(reply)
					const recipientId = sessionData.fbid
					witMessengerBot.sendMessage(recipientId,{text: "😵 I didn't get that, but I get smarter each message."},(err,info)=> {
						if(err) console.log(err)
					})
				})
			}
		})
	}


	//implementation of the wit.ai required send function with messenger platform sendMessage
	send(request,response){
		const{sessionId,context,entities} = request
		var witMessengerBot = this
		this.sessionHandler.read(sessionId, function(err,reply){
			const sessionData = JSON.parse(reply)
			const recipientId = sessionData.fbid
			const{text,quickreplies,confidence} = response
			let quick_replies = formatQuickReplies(quickreplies)
			witMessengerBot.sendMessage(recipientId,{text,quick_replies},(err,info)=> {
				if(err) console.log(err)
			})
		})
		return new Promise(function(resolve, reject){
			return resolve()
		})
	}


}

module.exports = WitMessengerBot
