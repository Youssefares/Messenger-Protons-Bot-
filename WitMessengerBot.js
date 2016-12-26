'use strict'
const {Wit, log} = require('node-wit')
const Bot = require('messenger-bot')
const {formatQuickReplies} = require('./fb_formatter')

//class with messenger bot & wit.ai instance composition
//main function: invoking NLP from wit.ai & the right actions thereof.
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
			witMessengerBot.sendMessage(recipientId,{text,quick_replies},(err,info)=> {
				if(err) console.log(err)
			})
			return resolve()
		})
	}


}

module.exports = WitMessengerBot
