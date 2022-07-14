const { TwitterApi } = require("twitter-api-v2");

const client = new TwitterApi({
  appKey: "APPLICATION_CONSUMER_KEY_HERE",
  appSecret: "APPLICATION_CONSUMER_SECRET_HERE",
  accessToken: "ACCESS_TOKEN_HERE",
  accessSecret: "ACCESS_TOKEN_SECRET_HERE",
});

const rwClient = client.readWrite;

module.exports = rwClient;
