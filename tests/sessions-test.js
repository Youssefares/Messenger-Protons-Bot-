'use strict'

let chai = require('chai')
let expect = chai.expect
let SessionHandler = require('../SessionHandler');
describe('Session Handler', function(){
  let sessionHandler = new SessionHandler()
  let fbid = '123423444'

  it('Should create session for fbid, should then find that same session then delete it, then not find it', function(done){
    sessionHandler.create(fbid, function(err, reply){
      sessionHandler.sessionForFbid(fbid, function(err, reply) {
        expect(reply).to.not.equal(null)
        var sessionId = reply

        sessionHandler.read(sessionId, function(err, reply){
          expect(reply).to.not.equal(null)
          expect(reply.fbid).to.equal(fbid)
          sessionHandler.delete(sessionId, function(err, reply){
            sessionHandler.read(sessionId, function(err, reply){
              expect(reply).to.equal(null)
              sessionHandler.sessionForFbid(fbid, function(err, reply){
                expect(reply).to.equal(null)
                done()
              })
            })
          })
        })
      })
    })
  })


  it('should find or create session based on scenario', function(done){
    sessionHandler.findOrCreateSession(fbid, function(err, reply){
      expect(reply).to.not.equal(null)
      var sessionId = reply
      console.log(sessionId)
      sessionHandler.read(sessionId, function(err, reply){
        expect(reply).to.deep.equal({fbid: fbid, context: {}})
        sessionHandler.findOrCreateSession(reply.fbid, function(err, reply){
          expect(reply).to.equal(sessionId)
          sessionHandler.delete(sessionId, function(err, reply){
            expect(err).to.equal(null)
            done()
          })
        })
      })
    })
  })
})
