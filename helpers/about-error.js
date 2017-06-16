//action(s) called by wit.ai when the user has an error problem. (When the entity 'error' is set to be exact.)
'use strict'
const request = require('request');

//gets error help for when an error type is specified
exports.aboutError = ({sessionId, context, text, entities}) => {

  return new Promise(function(resolve,reject){
    request.post({
      url:     'https://python-error-helper.herokuapp.com/error-help',
      form:    { error_message: text}
    }, function(error, response, body){

      //TODO: return better error.
      if(error) return reject(error)
      //if I don't have response I'll do sth else.
      else if(body == ''){
        context.about_error = "something_I_know_from_error_type"
      }
      else{
        var helpObj = JSON.parse(body)
        context.about_error = helpObj.response
      }
      return resolve(context)
    });
  })
}
