'use strict'
const {Wit, log} = require('node-wit')
const {actions} = require('./actions')
const Bot = require('messenger-bot')
const {formatQuickReplies} = require('./fb_formatter')


class WitMessengerBot{
	constructor(){

		//getting fb bot instance
		this.bot = new Bot({
			token: process.env.PAGE_ACCESS_TOKEN,
			verify: process.env.VERIFY_TOKEN //for webhooking the first time
		})

	}

	setactions(actions){
		actions['send'] = (request, response) =>{
			console.log(JSON.stringify(this))
			return this.send(request, response)
		}

		//getting wit app instance
		this.witInstance = new Wit({
	    	accessToken: process.env.WIT_ACCESS_TOKEN,
				actions: actions,
	    	logger: new log.Logger(log.DEBUG)
    })

  }

	runActions(sessionId, text, context, completionHandler){
		this.witInstance.runActions(sessionId,text,context).then(completionHandler)
	}

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

	toJSON(){
			return JSON.stringify({wit_client: this.instance, bot: this.bot})
	}

}



//initing the Natural Lang Processor with actions from actions.js
let witMessengerBot = new WitMessengerBot()
witMessengerBot.setactions(actions)
module.exports = {
	witMessengerBot: witMessengerBot
}
