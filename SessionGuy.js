'use strict'
let redis = require('redis')
let bluebird = require('bluebird')

bluebird.promisifyAll(redis.RedisClient.prototype)
bluebird.promisifyAll(redis.Multi.prototype)


/*
 * Sessions Dictionary with Redis
 * Key: fbId
 * Value: {conversationId "fbid-randomDateString", JSON-serialized context object }
 */
class SessionHandler{
  constructor(){
    this.client = redis.createClient()
  }

  findOrCreateSession(fbid){
    this.read(fbid).then(function(sessionId){
      return new Promise(function(resolve, reject){
        if(sessionId == null){
          return create(fbid)
        }
        else return resolve(sessionId)
      })
    })
  }

  create(fbid){
    let sessionId = fbid + "-" + new Date().toISOString()
    let sessionData = {
      sessionId: sessionId,
      context: {},
    }
    return this.write(sessionId, JSON.stringify(sessionData)).then(function(res){
      return new Promise(function(resolve, reject){
        console.log(sessionId)
        if(res) return resolve(sessionId)
      })
    })
  }

  fbIdFromSessionId(sessionId){
    return sessionId.substring(0,sessionId.indexOf("-"))
  }

  read(fbId){
    return this.client.getAsync(sessionId)
  }

  write(fbId, sessionData){
    return this.client.setAsync(fbId, sessionData)
  }

  delete(fbId){
    return this.client.delAsync(fbId)
  }

}


module.exports = SessionHandler
