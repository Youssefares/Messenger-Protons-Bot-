'use strict'

let chai = require('chai')
let expect = chai.expect
let SessionHandler = require('../SessionGuy');

let redis = require('redis')
let bluebird = require('bluebird')

bluebird.promisifyAll(redis.RedisClient.prototype)
bluebird.promisifyAll(redis.Multi.prototype)

describe('Session Handler', function(){
  let sessionHandler = new SessionHandler()
  let fbid = '123423444'

  //
  //
  // it('Should write something, then read it, then delete it', function(){
  //   client.setAsync('foo','bar').then(function(res){
  //     client.getAsync('foo').then(function(res){
  //       console.log(res)
  //       return client.delAsync('foo')
  //     }).then(function(res){
  //       return client.getAsync('foo')
  //     }).then(function(res){
  //       console.log(res)
  //     })
  //   })
  // })

  it('Should create session and get fbid from it', function(){
    sessionHandler.create(fbid).then(function(sessionId){
      console.log(sessionId)
      expect(sessionId).to.not.equal(null)
      let retrievedId = sessionHandler.fbIdFromSessionId(sessionId)
      expect(fbid).to.equal(retrievedId)
    })
  })

  //
  // it('Should create session for fbid, should then find that same session then delete it, then not find it', function(done){
  //   sessionHandler.create(fbid, function(err, reply){
  //     sessionHandler.sessionForFbid(fbid, function(err, reply) {
  //       expect(reply).to.not.equal(null)
  //       var sessionId = reply
  //
  //       sessionHandler.read(sessionId, function(err, reply){
  //         expect(reply).to.not.equal(null)
  //         expect(reply.fbid).to.equal(fbid)
  //         sessionHandler.delete(sessionId, function(err, reply){
  //           sessionHandler.read(sessionId, function(err, reply){
  //             expect(reply).to.equal(null)
  //             sessionHandler.sessionForFbid(fbid, function(err, reply){
  //               expect(reply).to.equal(null)
  //               done()
  //             })
  //           })
  //         })
  //       })
  //     })
  //   })
  // })
  //
  //
  // it('should find or create session based on scenario', function(done){
  //   sessionHandler.findOrCreateSession(fbid, function(err, reply){
  //     expect(reply).to.not.equal(null)
  //     var sessionId = reply
  //     console.log(sessionId)
  //     sessionHandler.read(sessionId, function(err, reply){
  //       expect(reply).to.deep.equal({fbid: fbid, context: {}})
  //       sessionHandler.findOrCreateSession(reply.fbid, function(err, reply){
  //         expect(reply).to.equal(sessionId)
  //         sessionHandler.delete(sessionId, function(err, reply){
  //           expect(err).to.equal(null)
  //           done()
  //         })
  //       })
  //     })
  //   })
  // })
})
