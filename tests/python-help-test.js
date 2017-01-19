'use strict'

let chai = require('chai')
let expect = chai.expect
let help = require('../helpers/python-help')

describe('helpers/python-help', function(){
  /*
  ________________________________
  Format:
  error message

  -it('description')
  -function call
  -tests
  _________________________________
  */


  /*
  Traceback (most recent call last):
  File "python", line 2
    if sth = sth:
           ^
  SyntaxError: invalid syntax
  */
  it('exec(regex) should not return null & should capture the two values being compared', function(){
    var helpObj = help("Traceback (most recent call last):\n  File \"python\", line 2\n    if variable = 6:\n             ^\n  SyntaxError: invalid syntax")
    //match?
    expect(helpObj).to.not.equal(null)
    //captured what it should capture?
    expect(helpObj.groups).to.deep.equal(["if", "variable", "6"])
  })





})
