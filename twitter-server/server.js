//Dependencies
var twitter = require('ntwitter');
var util = require('util');
var credentials = require('./credentials.js');
var MongoClient = require('mongodb').MongoClient
    , format = require('util').format;
var moment = require('moment'); 
    
// Twitter Stream Topics
var trackedTags = ['#usa','#america']; // topics

// oauth twitter client
var twit = new twitter({
  		consumer_key: credentials.consumer_key,
  		consumer_secret: credentials.consumer_secret,
  		access_token_key: credentials.access_token_key,
  		access_token_secret: credentials.access_token_secret
});


// MongoDB Client Connection - To your Local or remote MongoDB Database
// NOTE: The name is at the end of the connection : streamland
MongoClient.connect('mongodb://fxadmin:Password1@ds133231.mlab.com:33231/replaytweets', function(err, db) {
    if(err) {console.log(err);}     
    
    // create mongodb collection
    var collection = db.collection('fxtweets');
	  	
    // outside loop into stream
    twit.stream('statuses/filter',  { track: trackedTags }, function(stream) {
            // console.log(trackedTags);
            stream.on('data', function (data) {
                // look for your topic, write that tweet to mongodb
                trackedTags.forEach(function (trackedTags) {
                        var myRegExp = new RegExp(trackedTags)
                        //if text matches our input topics AND contains media
                        if (data.text.match(myRegExp) && data.entities.media != null) {

                        // insert mongodb record
                        // insert tweet -- mongo collection
                        collection.insert({'postDT': moment().format('MM-DD-YYYY HH:MM'), // GEO?
                                           'userName': data.user.screen_name, 
                                           'userImage': data.user.profile_image_url,
                                           'tweetImage': data.entities.media[0].media_url,
                                           'tweetText': data.text}, function(err, result) {
                                   if (err) { console.log(err);}
                        });
                        //
                        console.log("TWEET CAPTURED! " + moment().format('MM-DD-YYYY HH:MM') +" From: "+ data.user.screen_name);    
                        //
                        } 
                 });
            });
    });
});
//
//
