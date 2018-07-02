require('dotenv').config();
var _ = require('lodash');
var Promise = require('bluebird');
var Json2csvParser = require('json2csv').Parser;
var fs = require('fs');
var Client = require('instagram-private-api').V1;
var device = new Client.Device(process.env.INSTAGRAM_USER);
var storage = new Client.CookieFileStorage(__dirname + '/cookies/someuser.json');

const exportFollowersData = function(instagramUser){
    // And go for login
    Client.Session.create(device, storage, process.env.INSTAGRAM_USER, process.env.INSTAGRAM_PASSWORD)
        .then(function(session) {
            // Now you have a session, we can follow / unfollow, anything...
            // And we want to follow Instagram official profile
            console.log('Getting data from the user');
            return [session, Client.Account.searchForUser(session, instagramUser)]   
        })
        .spread(function(session, account) {
            var feed = new Client.Feed.AccountFollowers(session, account.id,10);
            console.log('Looking into the user followers');
            Promise.mapSeries(_.range(0,5), function(){
                return feed.get();
            }).then(function(results){
                var dataResult = [];
                var columns = [
                    'userId',
                    'profilePicUrl',
                    'username',
                    'fullName',
                    'isPrivate',
                    'followerCount'
                ];

                var promisesArray = [];
                
            _.forEach(results[0], function(data){
                    var user = new Client.Account.searchForUser(session, data._params.username);
                    promisesArray.push(user);

                })

                Promise.all(promisesArray).then(function(responseData){
                    _.forEach(responseData, function(resp){
                        var objectArray = {
                            'userId': resp._params.id,
                            'profilePicUrl': resp._params.profilePicUrl,
                            'username': resp._params.username,
                            'fullName': resp._params.fullName,
                            'isPrivate': resp._params.isPrivate,
                            'followerCount': resp._params.followerCount
                        };
                        dataResult.push(objectArray);
                    })
                    var toCsv = {
                        data: dataResult,
                        fields: columns,
                        hasCSVColumnTitle: false  
                    };
                    console.log('Parsing data');
                    var json2csvParser = new Json2csvParser({columns});
                    var csv = json2csvParser.parse(dataResult);
                    fs.writeFile('result.csv', csv, function(err){
                        if (err) throw err;
                        console.log('File created at: '+ __dirname+'\result.csv');
                    })

                })

                
                
            })
        })
    }

module.exports = {exportFollowersData};