'use strict'
let redis = require('redis')



/*
 * Sessions Dictionary with Redis
 * Key: facebook id of sender/recipient
 * Value: context object from wit.ai JSON-serialized as string
 */
class SessionHandler {

    constructor() {
        //getting redis instance
        this.client = redis.createClient()
    }


    //creates key-value pairs:  "sessionId: {fbid, context}" & "fbid: sessionId"
    create(fbid, completionHandler) {
        let sessionId = new Date().toISOString()
        let sessionData = {
            fbid: fbid,
            context: {},
        }
        this.write(sessionId, sessionData, completionHandler)
    }


    //gets {fbid, context} from sessionId and executes completionHandler
    read(sessionId, completionHandler) {
        this.client.get(sessionId, function(err, reply) {
            if(completionHandler) completionHandler(err, JSON.parse(reply))
        })
    }


    //reads or creates session
    findOrCreateSession(fbid, completionHandler) {
			  let self = this
				self.sessionForFbid(fbid, function(err, reply) {
            if (!reply) {
                self.create(fbid, function(err, reply){
                  self.sessionForFbid(fbid, completionHandler)
                })
            }
            else if (completionHandler) completionHandler(err, reply)
        })
    }


    //gets sessionId from fbid and executes completionHandler
    sessionForFbid(fbid, completionHandler) {
        this.client.get(fbid, function(err, reply) {
            if(completionHandler) completionHandler(err, reply)
        })
    }


    //writes key-value pairs:  "sessionId: {fbid, context}" & "fbid: sessionId"
    write(sessionId, sessionData, completionHandler) {
        let self = this
        self.client.set(sessionId, JSON.stringify(sessionData), function(err,reply){
          if(completionHandler) self.client.set(sessionData.fbid, sessionId, completionHandler)
          else self.client.set(sessionData.fbid, sessionId)
        })

    }

    //deletes both key-value pairs associated with sessionId
    delete(sessionId, completionHandler) {
        let self = this
        self.read(sessionId, function(err, reply) {
            self.client.del(reply.fbid, function(err, reply){
              if(completionHandler) self.client.del(sessionId, completionHandler)
              else self.client.del(sessionId)
            })
        })
    }
}

module.exports = SessionHandler
