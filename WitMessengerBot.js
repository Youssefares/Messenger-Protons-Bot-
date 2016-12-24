'use strict'
const {Wit, log} = require('node-wit')
const Bot = require('messenger-bot')
const {formatQuickReplies} = require('./fb_formatter')

//class with messenger bot & wit.ai instance composition
//main function: invoking NLP from wit.ai & the right actions thereof.
class WitMessengerBot{

	//constructor with wit.ai desired actions
	//TODO: modify constructor parameters to include instance intialization TOKENs
	constructor(actions){

		//getting fb bot instance
		this.bot = new Bot({
			token: process.env.PAGE_ACCESS_TOKEN,
			verify: process.env.VERIFY_TOKEN //for webhooking the first time
		})

		//add the default send function as a function that calls the method: this.send
		actions['send'] = (request, response) =>{
			return this.send(request, response)
		}

		//getting wit app instance with the actions defined
		this.witInstance = new Wit({
	    	accessToken: process.env.WIT_ACCESS_TOKEN,
				actions: actions,
	    	logger: new log.Logger(log.DEBUG)
    })
	}

	//run actions of the wit.ai instance
	runActions(sessionId, text, context, completionHandler){
		this.witInstance.runActions(sessionId,text,context).then(completionHandler)
	}

	//implementation of the wit.ai required send function with messenger platform sendMessage
	send(request,response){
		const{sessionId,context,entities} = request
		const recipientId = sessionId
		const{text,quickreplies,confidence} = response
		let quick_replies = formatQuickReplies(quickreplies)

		var witMessengerBot = this
		return new Promise(function(resolve, reject){
			witMessengerBot.bot.sendMessage(recipientId,{text,quick_replies},(err,info)=> {
				if(err) console.log(err)
			})
			return resolve()
		})
	}

	//serializer for debugging
	toJSON(){
			return JSON.stringify({wit_client: this.instance, bot: this.bot})
	}

}

module.exports = WitMessengerBot
