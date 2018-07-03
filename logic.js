require('dotenv').config();
var _ = require('lodash');
var Promise = require('bluebird');
var Json2csvParser = require('json2csv').Parser;
var fs = require('fs');
var Client = require('instagram-private-api').V1;
var device = new Client.Device(process.env.INSTAGRAM_USER);
var storage = new Client.CookieFileStorage(__dirname + '/cookies/someuser.json');
var Spinner = require('cli-spinner').Spinner;

var spinner = new Spinner('Getting data..%s');
spinner.setSpinnerString(0);

//Function to get data from your account
const getMyData = function(username){
    spinner.start();
    Client.Session.create(device, storage,process.env.INSTAGRAM_USER, process.env.INSTAGRAM_PASSWORD)
        .then(function(session){
            return [session, Client.Account.searchForUser(session, process.env.INSTAGRAM_USER)]
        })
        .spread(function(session, account){
            var myData = {
                'id': account.id,
                'username': account._params.username,
                'fullName': account._params.fullName,
                'isPrivate': account._params.isPrivate,
                'followerCount': account._params.followerCount
            }
            spinner.stop(true);
            console.log(myData);
        })
}

//Function to export followers data to a CSV File
const exportFollowersData = function(instagramUser){
    spinner.start();

    //Log In and create session
    Client.Session.create(device, storage, process.env.INSTAGRAM_USER, process.env.INSTAGRAM_PASSWORD)
        .then(function(session) {
           // console.log('Getting data from the user');
            //Search for user data
            return [session, Client.Account.searchForUser(session, instagramUser)]   
        })
        .spread(function(session, account) {
            //Get feed of the accounts that follows the user
            var feed = new Client.Feed.AccountFollowers(session, account.id,10);
           // console.log('Looking into the user followers');
            Promise.mapSeries(_.range(0,5), function(){
                return feed.get();
            }).then(function(results){
                var dataResult = [];
                //Set columns names for CSV file
                var columns = [
                    'userId',
                    'profilePicUrl',
                    'username',
                    'fullName',
                    'isPrivate',
                    'followerCount'
                ];

                var promisesArray = [];
                
            //Iterate users to get more data
            _.forEach(results[0], function(data){
                    var user = new Client.Account.searchForUser(session, data._params.username);
                    promisesArray.push(user);

                })

                Promise.all(promisesArray).then(function(responseData){
                    //Iterate promise data to create an object with the data required
                    _.forEach(responseData, function(resp){
                        var objectArray = {
                            'userId': resp._params.id,
                            'profilePicUrl': resp._params.profilePicUrl,
                            'username': resp._params.username,
                            'fullName': resp._params.fullName,
                            'isPrivate': resp._params.isPrivate,
                            'followerCount': resp._params.followerCount
                        };
                        //Store every object inside an array
                        dataResult.push(objectArray);
                    })
                    //Create csv data
                    var toCsv = {
                        data: dataResult,
                        fields: columns,
                        hasCSVColumnTitle: false  
                    };
                    //console.log('Parsing data');
                    //Parse info from json to CSV
                    var json2csvParser = new Json2csvParser({columns});
                    var csv = json2csvParser.parse(dataResult);
                    //Create and write csv file
                    fs.writeFile('result.csv', csv, function(err){
                        if (err) throw err;
                        spinner.stop(true);
                        setTimeout(function(){
                            console.log('File created at: '+__dirname+'\\result');
                        },1500);
                    })

                })

                
                
            })
        })
    }

module.exports = {exportFollowersData, getMyData};