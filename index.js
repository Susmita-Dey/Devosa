const rwClient = require("./twitterClient.js");
// const CronJob = require("cron").CronJob;

const tweet = async () => {
  try {
    await rwClient.v2.tweet("Hello World. Open Source is awesome.");
  } catch (e) {
    console.error(e);
  }
};

// Utility function - Gives unique elements from an array
const onlyUnique = (value, index, self) => {
  return self.indexOf(value) === index;
};

const retweet = (searchText) => {
  // Params to be passed to the 'search/tweets' API endpoint
  let params = {
    q: searchText + "",
    result_type: "mixed",
    // count: 25,
  };

  console.log("Searching for data...");
  
  rwClient.v2.get(
    "search/tweets.json",
    params,
    function (err_search, data_search, response_search) {
      let tweets = data_search.statuses;
      if (!err_search) {
        let tweetIDList = [];
        for (let tweet of tweets) {
          // To avoid duplication of retweets
          if (tweet.text.startsWith("RT @")) {
            // If tweet text starts with "RT @" then it is a retweeted tweet,
            // with a different 'id_str' than the original
            console.log("\nStarts with RT@, adding retweeted status id_str");
            if (tweet.retweeted_status) {
              tweetIDList.push(tweet.retweeted_status.id_str);
            } else {
              tweetIDList.push(tweet.id_str);
            }
          } else {
            tweetIDList.push(tweet.id_str);
          }
        }

        // Get only unique entries
        tweetIDList = tweetIDList.filter(onlyUnique);

        console.log("TweetID LIST = \n" + tweetIDList);

        // Call the 'statuses/retweet/:id' API endpoint for retweeting EACH of the tweetID
        for (let tweetID of tweetIDList) {
          rwClient.v2.post(
            "statuses/retweet/:id.json",
            { id: tweetID },
            function (err_rt, data_rt, response_rt) {
              if (!err_rt) {
                console.log("\n\nRetweeted! ID - " + tweetID);
              } else {
                console.log("\nError... Duplication maybe... " + tweetID);
                console.log("Error = " + err_rt);
              }

              // For debugging
              console.log("Data = " + data_rt.text);
              console.log(data_rt);
            }
          );
        }
      } else {
        console.log("Error while searching" + err_search);
        process.exit(1);
      }
    }
  );
};

// Run every 60 seconds
setInterval(function () {
  retweet("OpenSource");
}, 10000);

// const job = new CronJob("* * * * *", () => {
//   console.log("Cron job starting..");
//   retweet("#OpenSource");
//   // retweet('#DataScience OR #DataVisualization');
// });

// job.start();
