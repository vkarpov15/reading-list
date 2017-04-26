'use strict'

const Archetype = require('archetype-js')

module.exports = new Archetype({
  createdAt: {
    $type: Date,
    $default: new Date()
  },
  title: {
    $type: 'string',
    $required: true
  },
  author: {
    $type: 'string',
    $required: true
  }
}).compile('BookType')
