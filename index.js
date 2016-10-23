'use strict'
const http = require('http')
const Bot = require('messenger-bot')
const express = require('express')
const bodyParser = require('body-parser')


let bot = new Bot({
	token: process.env.PAGE_ACCESS_TOKEN
})


bot.on('error',(err) => {
	console.log(err.message)
})

bot.on('message', (payload, reply) => {
  let text = payload.message.text

  bot.getProfile(payload.sender.id, (err, profile) => {
    if (err) throw err

    reply({ text }, (err) => {
      if (err) throw err

      console.log(`Echoed back to ${profile.first_name} ${profile.last_name}: ${text}`)
    })
  })
})

let app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

app.get('/', (req, res) => {
  return bot._verify(req, res)
})

app.post('/', (req, res) => {
  bot._handleMessage(req.body)
  res.end(JSON.stringify({status: 'ok'}))
})

http.createServer(app).listen(process.env.PORT || 3000)




function receivedMessage(event){
	  var senderID = event.sender.id;
	  var recipientID = event.recipient.id;
	  var timeOfMessage = event.timestamp;
	  var message = event.message;

	  console.log("Received message for user %d and page %d at %d with message:", 
	    senderID, recipientID, timeOfMessage);
	  console.log(JSON.stringify(message));

	  var messageID = message.mid;

	  // You may get a text or attachment but not both
	  var messageText = message.text;
	  var messageAttachments = message.attachments;

	  if (messageText){
	  	messageText = messageText.toLowerCase();
	  	var keyword = "error";
	  	var index = messageText.search(keyword);
	  	if (index >= 0){
	  		var errorMessage = messageText.slice(index+keyword.length ,messageText.length);
	  		sendToStack(senderID,errorMessage);
	  	}
	  	else{
	  		sendMessage(senderID, {text: "did you just say " + event.message.text+"?"});
	  	}
	  }
}

// sends text messages
function sendMessage(recipientId, message) {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: process.env.PAGE_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id: recipientId},
            message: message,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
};


// sends to stackoverflow
function sendToStack(recipientId,trouble) {
	var element = {
        title: "You might find this helpful",
        subtitle: "It's yelling: "+trouble,
        item_url: "http://stackoverflow.com/search?q="+trouble,               
        image_url: "https://d13yacurqjgara.cloudfront.net/users/1249/screenshots/1889069/stackoverflow-logo.png",
        buttons: [{
          type: "web_url",
          url: "http://stackoverflow.com/search?q="+trouble,
          title: "Go to Stack"
        }, {
          type: "postback",
          title: "Not helpful?",
          payload: "Payload for first bubble",
        }],
    }
    var message = {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [element] 
        }
      }
    };
  sendMessage(recipientId, message);
}