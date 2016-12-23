'use strict'
const {Wit, log} = require('node-wit')
const {bot, actions} = require('./actions')


//Wrapper NLP class for what's currently a wit.ai processor
class NLProcessor{
	constructor(bot, actions){
		this.bot = bot
		this.instance = new Wit({
	    	accessToken: process.env.WIT_ACCESS_TOKEN,
	    	actions: actions,
	    	logger: new log.Logger(log.DEBUG)
        })
	}

	toJSON(){
		return JSON.stringify({wit_client: this.instance, bot: this.bot})
	}

	runActions(sessionId, text, context, completionHandler){
		this.instance.runActions(sessionId,text,context).then(completionHandler)
	}
}



//initing the Natural Lang Processor with actions from actions.js
let processor = new NLProcessor(bot, actions)
module.exports = {
	processor: processor
}
