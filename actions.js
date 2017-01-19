//Bot client-side actions called upon by the Natural Language Processors (currently Wit.ai)
'use strict'

//defining Natural Language Processor actions
const actions = {

    //looks at the user's entities & intent and modifies the context object accordingly
	  defineIntent({context, entities}){
			return new Promise(function(resolve,reject){
				//if no intent defined, do nothing
				//handling when defineIntent is the very first called action.
				if(!entities){
					return reject(new Error('Got called at wrong time'))
				}
				if(!('intent' in entities)){
					return reject(new Error('Intent Undefined'))
				}

				//else great.
				else{
					//look at intent
					let intent = entities.intent[0].value
					switch(intent){
						case "error":
						  //if the intent is error && error type is known:
							  //set the context-key: error
							if('error' in entities){
								context["error"] = true
							}
							//if the intent is error && error type is unknown:
								//set the context-key: error(unspecified)
							else{
								context["error(unspecified)"] = true
							}
							break

							//else just set context-key: *whatever intent is*
						default:
							context[intent] = true
					}
					return resolve(context)
				}
			})
		},

		//gets error help for when an error type is specified
		aboutError({context, entities}){
			return new Promise(function(resolve,reject){
				//api call goes here
				context.about_error= "error_help"
				return resolve(context)
			})
	  },

		//clears the context object completely
		clearContext({context}){
			return new Promise(function(resolve,reject){
				context = {}
				return resolve(context)
			})
		}
}

module.exports = actions
