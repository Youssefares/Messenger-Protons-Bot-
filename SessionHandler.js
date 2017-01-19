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
		this.TTL = 60*60*2  //time to live for sessions with expiration time
	}

	read(sessionId,completionHandler){
		this.client.get(sessionId, completionHandler)
	}

	create(sessionId){
		this.writeWithExpiration(sessionId, '{}')
	}

	write(sessionId, sessionData){
		this.client.set(sessionId, sessionData)
	}

	writeWithExpiration(sessionId, sessionData){
		this.write(sessionId, sessionData)
		this.client.expire(sessionId, this.TTL)
	}
}

module.exports = SessionHandler
