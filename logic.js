require('dotenv').config();
var Client = require('instagram-private-api').V1;
var device = new Client.Device(process.env.INSTAGRAM_USER);
var storage = new Client.CookieFileStorage(__dirname + '/cookies/someuser.json');

// And go for login
Client.Session.create(device, storage, process.env.INSTAGRAM_USER, process.env.INSTAGRAM_PASSWORD)
	.then(function(session) {
   		// Now you have a session, we can follow / unfollow, anything...
		// And we want to follow Instagram official profile
		return [session, Client.Account.searchForUser(session, 'saschafirtina')]   
	})
	.spread(function(session, account) {
        var feed = Client.Feed.AccountFollowers(session, account.id,10);

        console.log(feed);
	}).then();