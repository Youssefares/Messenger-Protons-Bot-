//file with basic received, seen, typing.. interaction for bot
'use strict'

exports.actHuman = (bot, senderId) =>{
  //let user know the bot has seen the message
  bot.sendSenderAction(senderId, 'mark_seen', function(err, reply) {
      if (err) throw err
  })

  //let user know the bot is typing..
  bot.sendSenderAction(senderId, 'typing_on', function(err, reply) {
      if (err) throw err
  })
}
