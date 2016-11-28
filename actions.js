//Bot client-side actions called upon by the Natural Language Processors (currently Wit.ai)
'use strict'


const Bot = require('messenger-bot')
const config = require('./config')
const {sessions} = require('./sessions')
const {formatQuickReplies} = require('./fb_formatter')

//getting fb bot instance
let bot = new Bot({
	token: config.PAGE_ACCESS_TOKEN,
	verify: config.VERIFY_TOKEN //for webhooking the first time
})


//defining Natural Language Processor actions
const actions = {
	
    aboutError({context, entities}){
		//debugging
		//bugging..erm, coding.
		return new Promise(function(resolve,reject){
			//api call goes here
			context.about_error= "error_help"
			return resolve(context)
		})
	},

	send(request,response){
		const{sessionId,context,entities} = request
		const recipientId = sessions[sessionId].fbid
		const{text,quickreplies,confidence} = response

		let quick_replies = formatQuickReplies(quickreplies)

		return new Promise(function(resolve, reject){	
			bot.sendMessage(recipientId,{text,quick_replies},(err,info)=> {
				if(err) console.log(err)
			})
			return resolve()
		})
    }
	
}

module.exports = {
	bot:bot, 
	actions:actions
}