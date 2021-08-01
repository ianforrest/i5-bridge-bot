const Twitter = require('twitter-v2');

const client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

var tweetMessage = "An Interstate 5 bridge lift is underway."
var tweetHashtags = "#pdxtraffic #vanwa"

function sendTweet() {
	client.post('statuses/update', { status: tweetMessage }, function(err, data, response) {
		console.log(data);
	});
	console.log("Sending tweet: " + tweetMessage);
}

module.exports = {
  sendTweet
}