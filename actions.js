//Bot client-side actions called upon by the Natural Language Processors (currently Wit.ai)
'use strict'


const Bot = require('messenger-bot')
const config = require('./config')
const {sessions} = require('./sessions')

//getting fb bot instance
let bot = new Bot({
	token: config.PAGE_ACCESS_TOKEN,
	verify: config.VERIFY_TOKEN //for webhooking the first time
})


//defining Natural Language Processor actions
const actions = {
	
    aboutError({context, entities}){
		//debugging
		console.log("context:")
		console.log(context)
		
		//bugging..erm, coding.
		return new Promise(function(resolve,reject){
			//api call goes here
			
			context.error_help= "{error_help}"
			return resolve(context)
		})
	},

	send(request,response){
		const{sessionId,context,entities} = request
		const recipientId = sessions[sessionId].fbid
		console.log(context)
		const{text,quickreplies,confidence} = response

		let quick_replies
		if(quickreplies){
			
			quick_replies = []
			
			for(var reply of quickreplies){
				console.log(reply)
				quick_replies.push({
					"content_type":"text",
					"title":reply,
					"payload": reply+"_"+recipientId
				})
			}
			console.log(quick_replies)
	    }

		return new Promise(function(resolve, reject){	
			bot.sendMessage(recipientId,{text,quick_replies},(err,info)=> {
				if(err) console.log(err)
				else console.log(JSON.stringify(info))
			})
			return resolve()
		})
    }
	
}

module.exports = {
	bot:bot, 
	actions:actions
}