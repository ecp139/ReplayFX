$.ajax({
  type: "GET",
  url: "https://api.mongolab.com/api/1/databases/replaytweets/collections/fxtweets",
  contentType: "application/json",
  data: {
    // Query string data from the url goes here (the part after the question mark ? in a url)
    "apiKey": "GNTzkTa9ucksY89SsIgyW3rN0mdfc1AH"
  },
  success: function(tweet_data) {
    for(i = 0; i < tweet_data.length; i++){
      console.log('Post ['+ i +'] ID: '+ tweet_data[i]._id.$oid);
      // still need to figure out how to pass parameter to delete tweet
      $('#socialFeed').append((i === 0 ? '<div class="item active">' : '<div class="item">') + '<div class="tweet' +i+ '"><div class="tweet-container">'
      +'<div class="row">'
        +'<div class="col-sm-12">'
          +'<div class="section">'
            +'<div class="corner tl">'
              +'<div class="a"></div>'
              +'<div class="b"></div>'
              +'<div class="c"></div>'
            +'</div>'
            +'<div class="corner tr">'
              +'<div class="a"></div>'
              +'<div class="b"></div>'
              +'<div class="c"></div>'
            +'</div>'
            +'<div class="section_content">'
        +'<div class="tweet-container2">'
        +'<div class="row green">'
          +'<div class="col-sm-10">'
            +'<div class="row.small">'
          +'<p class="handle">@' +tweet_data[i].userName+ '</p>'
        +'</div>'
          +'</div>'
          +'<div class="col-sm-2">'
            +'<img class="tlogo" src="twitter.png">'
          +'</div>'
        +'</div>'
        +'<div class="row green">'
          +'<div class="col-sm-12 blue tweet-img" id="pic_'+ tweet_data[i]._id.$oid +'">'
          +'</div>'
        +'</div>'
        +'<div class="row blue">'
          +'<div class="col-sm-12">'
            +'<div class="twext"><p class="twext">'+tweet_data[i].tweetText+'</p></div>'
          +'</div>'
        +'</div>'
        +'</div>'
              +'<div class="corner bl">'
                +'<div class="a"></div>'
                +'<div class="c"></div>'
                +'<div class="b"></div>'
              +'</div>'
              +'<div class="corner br">'
                +'<div class="a"></div>'
                +'<div class="c"></div>'
                +'<div class="b"></div>'
              +'</div>'
              +'</div>'
        +'</div>'
        +'</div></div></div></div></div>');

        var imageToLoad = tweet_data[i].tweetImage;
        var remoteImage = new RAL.RemoteImage({src: imageToLoad, width: "100%", height: "300px"});
        $("#pic_" + tweet_data[i]._id.$oid).append(remoteImage.element);
        RAL.Queue.add(remoteImage);
    }
    RAL.Queue.setMaxConnections(4);
    RAL.Queue.start();
  },
  error: function(request, errorType, errorMessage) {
    console.log("ERROR: " + errorMessage);
  }
});
