//action(s) called by wit.ai when the user has an error problem. (When the entity 'error' is set to be exact.)
'use strict'

const help = require('./python-help')

//gets error help for when an error type is specified
exports.aboutError = ({context, entities}) => {
  return new Promise(function(resolve,reject){

    context.about_error= "error_help"
    return resolve(context)
  })
}
