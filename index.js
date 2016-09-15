var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.listen((process.env.PORT || 3000));

// Server frontpage
app.get('/', function (req, res) {
    res.send('This is Github integrated TestBot Server');
});

// Facebook Webhook
app.get('/webhook', function (req, res) {
    if (req.query['hub.verify_token'] === 'testbot_verify_token') {
        res.send(req.query['hub.challenge']);
    } else {
        res.send('Invalid verify token');
    }
});


// handler receiving messages
app.post('/webhook', function (req, res) {
    var events = req.body.entry[0].messaging;
    for (i = 0; i < events.length; i++) {
        var event = events[i];
        if (event.message && event.message.text) {
            receivedMessage(event);
        }
    }
    res.sendStatus(200);
});


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
	  	var index = messageText.search("error");
	  	if (index >= 0){
	  		var errorMessage = messageText.slice(index+5,messageText.length);
	  		sendToStack(senderID,errorMessage);
	  	}
	  	else{
	  		sendMessage(senderID, {text: "did you just say " + event.message.text+"?"+index});
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


// sends structured message with a generic template
function sendToStack(recipientId,trouble) {
    var message = {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [{
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
          }]
        }
      }
    };
  sendMessage(recipientId, message);
}