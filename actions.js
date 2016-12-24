//Bot client-side actions called upon by the Natural Language Processors (currently Wit.ai)
'use strict'

const Bot = require('messenger-bot')
const {formatQuickReplies} = require('./fb_formatter')

//getting fb bot instance
let bot = new Bot({
	token: process.env.PAGE_ACCESS_TOKEN,
	verify: process.env.VERIFY_TOKEN //for webhooking the first time
})


//defining Natural Language Processor actions
const actions = {
	  defineIntent({context, entities}){
			return new Promise(function(resolve,reject){
					if('intent' in entities){
						let intent = entities.intent[0].value

						switch(intent){
							case "error":
								if('error' in entities){
									context["error"] = true
								}
								else{
									context["error(unspecified)"] = true
								}
								break

							default:
								context[intent] = true
						}
						return resolve(context)
					}
					else{
						return reject(context)
					}
			})
		},

		aboutError({context, entities}){
			return new Promise(function(resolve,reject){
				//api call goes here
				context.about_error= "error_help"
				delete context.hasNotError
				return resolve(context)
			})
	  },

		send(request,response){
			const{sessionId,context,entities} = request
			const recipientId = sessionId
			const{text,quickreplies,confidence} = response

			let quick_replies = formatQuickReplies(quickreplies)

			return new Promise(function(resolve, reject){
				bot.sendMessage(recipientId,{text,quick_replies},(err,info)=> {
					if(err) console.log(err)
				})
				return resolve()
			})
	  },

		clearContext({context}){
			return new Promise(function(resolve,reject){
				context = {}
				return resolve(context)
			})
		}
}

module.exports = {
	bot:bot,
	actions:actions
}
