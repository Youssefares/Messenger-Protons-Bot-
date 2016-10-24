'use strict'
const {Wit, log} = require('node-wit')
const config = require('./config')

//Wrapper NLP class for what's currently a wit.ai processor
class NLProcessor{

	constructor(){
		this.instance = new Wit({
	    	accessToken: config.WIT_ACCESS_TOKEN,
	    	logger: new log.Logger(log.DEBUG)
        })
	}


	toJSON(){
		return JSON.stringify(this.instance)
	}

	message(text,context,completionHandler){
		this.instance.message(text,context)
	    .then(completionHandler)
	}
}

module.exports = NLProcessor



// let processor = new NLProcessor()
// console.log(JSON.stringify(processor))