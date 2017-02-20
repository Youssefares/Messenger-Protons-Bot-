'use strict'

//called onlyif context has {about_error, error} to check if bot was helpful
exports.isHelpful = ({context, entities}) => {
  return new Promise(function(resolve, reject){
    //handling action timing error
    if(!entities){
      return reject(new Error('Got called at wrong time'))
    }
    //if no intent defined, do nothing
    if(!('intent' in entities)){
      return reject(new Error('Intent Undefined'))
    }

    entities.intent.forEach((intent) =>{
      switch(intent.value){
        case 'helpful':
          context[intent.value] = true
        case 'not-helpufl':
          context[intent.value] = true
        default:
          return reject(new Error('unexpected intent value'))
      }
    })

    return resolve(context)
  })
}
