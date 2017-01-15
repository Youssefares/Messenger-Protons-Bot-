'use strict'

let chai = require('chai')
let expect = chai.expect
var help = require('../helpers/python-help')

// help('if   ds3   =   "fdsfsd":\n           ^\nSyntaxError: invalid syntax')
// help("Traceback (most recent call last):\n  File \"python\", line 2\n    if Tee5a = 6:\n             ^\n  SyntaxError: invalid syntax")
// help("Traceback (most recent call last):\n  File \"python\", line 2\n    if    Tee5a    =         6:\n                   ^\nSyntaxError: invalid syntax")
//

describe('helpers/python-help', function(){
  it('exec(regex) should not return null & should capture the two values being compared', function(){

    //regex matching
    var regex = /if\s+?(\w+)\s*=\s*(.+)\s*?:\s+.*\s+SyntaxError: invalid syntax/
    var data = regex.exec("Traceback (most recent call last):\n  File \"python\", line 2\n    if Tee5a = 6:\n             ^\n  SyntaxError: invalid syntax")

    expect(data == null).to.equal(false)
    expect(data[1]).to.equal("Tee5a")
    expect(data[2]).to.equal("6")
  })
})
