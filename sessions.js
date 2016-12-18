'use strict'

/*
 * Sessions Dictionary
 * Key: an ISO date string return value of findOrCreateSession
 * Value: {fbid, context} object
 *
 */
const sessions = {};

exports.findOrCreateSession = (fbid) => {
	let sessionId;

	//already got session key?
	Object.keys(sessions).forEach(k => {
		//Yes? Got it.
		if(sessions[k].fbid == fbid){
			sessionId = k;
		}
	})

	//No? Create one.
	if(!sessionId){
		sessionId = new Date().toISOString()
		sessions[sessionId] = {fbid: fbid, context: {}}
	}
	return sessionId
}

exports.sessions = sessions
