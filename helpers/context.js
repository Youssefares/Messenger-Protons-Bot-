//basic actions for the addition & deletion of properties on the context object inside of the user's session.
//stored with composition inside the WitMessengerBot instance. Called inside WitMessengerBot.runActions.
'use strict'

//looks at the user's entities & intent and modifies the context object accordingly
exports.defineIntent = ({context, entities}) => {
  return new Promise(function(resolve,reject){
    //handling when defineIntent is the very first called action.
    if(!entities){
      return reject(new Error('Got called at wrong time'))
    }
    //if no intent defined, do nothing
    if(!('intent' in entities)){
      return reject(new Error('Intent Undefined'))
    }
    //look at intent
    entities.intent.forEach((intent) =>{
      switch(intent.value){
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

          //else just set context-key: *whatever intent is* to true
        default:
          context[intent.value] = true
      }
    })
    return resolve(context)
  })
}


//clears the context object completely
exports.clearContext = ({context}) =>{
  return new Promise(function(resolve,reject){
    context = {}
    return resolve(context)
  })
}
