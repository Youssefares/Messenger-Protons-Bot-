//action(s) called by wit.ai when the user has an error problem. (When the entity 'error' is set to be exact.)
'use strict'

const help = require('./python-help')

//gets error help for when an error type is specified
exports.aboutError = ({sessionId, context, text, entities}) => {
  return new Promise(function(resolve,reject){
    var about_error = help(text).response
    if(about_error){
      context.about_error = about_error
    }
    return resolve(context)
  })
}
