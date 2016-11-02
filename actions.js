//Bot client-side actions called upon by the Natural Language Processors (currently Wit.ai)
'use strict'

//getting fb bot instance
const Bot = require('messenger-bot')
const config = require('./config')


let bot = new Bot({
		token: config.PAGE_ACCESS_TOKEN,
		verify: config.VERIFY_TOKEN //for webhooking the first time
	})

const actions = {
	send(request,response){
		const{sessionId,context,entities} = request
		const{text,quickreplies} = response

		return new Promise(function(resolve, reject){
			console.log(JSON.stringify(response))
			console.log(JSON.stringify(request))

			return resolve()
		})
    },

	aboutError({context, entities}){
		//debugging
		console.log("context:")
		console.log(context)
		
		//bugging..erm, coding.
		return new Promise(function(resolve,reject){
			//api call goes here
			
			context.error_help = "{error_help}"
			return resolve(context)
		})
	}
}

module.exports = {
	bot:bot, 
	actions:actions
}
