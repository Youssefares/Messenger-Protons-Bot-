//Bot client-side actions called upon by the Natural Language Processors (currently Wit.ai)
'use strict'

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

		clearContext({context}){
			return new Promise(function(resolve,reject){
				context = {}
				return resolve(context)
			})
		}
}

module.exports = {
	actions:actions
}
