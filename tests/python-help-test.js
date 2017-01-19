'use strict'

let chai = require('chai')
let expect = chai.expect
let help = require('../helpers/python-help')

describe('helpers/python-help: help()', function(){
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
  it('should not return null & should capture the two values being compared + if or while', function(){
    var helpObj = help("Traceback (most recent call last):\n  File \"python\", line 2\n    if variable = 6:\n             ^\n  SyntaxError: invalid syntax")
    //match?
    expect(helpObj).to.not.equal(null)
    //captured what it should capture?
    expect(helpObj.groups).to.deep.equal(["if", "variable", "6"])
  })

  /*
  Traceback (most recent call last):
  File "python", line 2
    while variable == 6
                      ^
  SyntaxError: invalid syntax
  */

  it('should not return null & should capture while', function(){
    var helpObj = help("Traceback (most recent call last):\n  File \"python\", line 2\n    while variable == 6\n                      ^\nSyntaxError: invalid syntax")
    expect(helpObj).to.not.equal(null)
    expect(helpObj.groups).to.deep.equal(["while"])
  })

  /*
  Traceback (most recent call last):
  File "python", line 4
    if x == y+1
              ^
  SyntaxError: invalid syntax
  */
  it('should not return null & should capture if',function(){
    var helpObj = help("Traceback (most recent call last):\n  File \"python\", line 4\n    if x == y+1\n              ^\nSyntaxError: invalid syntax")
    expect(helpObj).to.not.equal(null)
    expect(helpObj.groups).to.deep.equal(["if"])
  })

})
