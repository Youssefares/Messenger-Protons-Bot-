//Bot client-side actions called upon by the Natural Language Processors (currently Wit.ai)
'use strict'
const {defineIntent, clearContext} = require('./helpers/context')
const {aboutError} = require('./helpers/about-error');

//defining Natural Language Processor actions
const actions = {
    defineIntent: defineIntent,
		aboutError: aboutError,
		clearContext: clearContext
}

module.exports = actions
