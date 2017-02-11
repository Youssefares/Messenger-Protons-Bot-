'use strict'
let redis = require('redis')



/*
 * Sessions Dictionary with Redis
 * Key: facebook id of sender/recipient
 * Value: context object from wit.ai JSON-serialized as string
 */
class SessionHandler{

	constructor(){
		//getting redis instance
		this.client = redis.createClient()
		// this.TTL = 60*60*2  //time to live for sessions with expiration time
	}

	read(sessionId,completionHandler){
		this.client.get(sessionId, function(err,reply){
			console.log(reply)
			completionHandler(err, JSON.parse(reply))
		})
	}

	delete(sessionId){
		this.client.del(sessionId)
	}

	// create(sessionId){
	// 	this.writeWithExpiration(sessionId, '{}')
	// }

	write(sessionId, sessionData){
		this.client.set(sessionId, JSON.stringify(sessionData))
	}

	// writeWithExpiration(sessionId, sessionData){
	// 	this.write(sessionId, sessionData)
	// 	this.client.expire(sessionId, this.TTL)
	// }
}

module.exports = SessionHandler
