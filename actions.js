//Bot client-side actions called upon by the Natural Language Processors (currently Wit.ai)
'use strict'

//getting fb bot instance
const Bot = require('messenger-bot')
const config = require('./config')


let bot = new Bot({
		token: config.PAGE_ACCESS_TOKEN,
		verify: 'BOT_VERIFY' //for webhooking the first time
	})

const actions = {
	send({sessionId},{text}){
		bot.getProfile(sessionId, (err, profile) => {
		    if (err) throw err
		        
		    console.log(text)
		    // reply({ text }, (err) => {
		    //     if (err){
		    //     	console.log(JSON.stringify(err))
		    //     	throw err
		    //     }

		    //     console.log(`Echoed back to ${profile.first_name} ${profile.last_name}: ${text}`)
		    // })
        })
    },

	aboutError({context, entities}){
		//debugging
		console.log("context:"+context)
		console.log("context:"+context)

		//bugging..erm, code.
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
