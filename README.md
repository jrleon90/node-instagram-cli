# NodeJS Command Line Interface for Instagram API

## Table of Content
1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Commands](#commands)

## Introduction <a name="introduction"></a>

This is a command line developed to get the public information of someone's followers and export this data to a CSV file.

This application is build with the ```instagram-private-api``` (https://github.com/huttarichard/instagram-private-api)

## Installation <a name="installation"></a>

1. Clone this repository
2. Run ```npm install```
3. Change file name ```example.env``` to ```.env```
4. Replace data inside ```.env``` with the one of your Instagram user

## Commands <a name="commands"></a>

1. **Help**

To get information about the commands, run the application with:

```node command.js --help```

The response it would be a list with the command list that are implemented (See image below)

![alt text](http://res.cloudinary.com/jrleon90/image/upload/v1530618646/command-help.png "Help command")

2. **Export followers data**

To import the information to a csv file, run the application with:

```node command.js exportData <instagramUsername>```

Or

```node command.js e <instagramUsername>```

Replace ```<instagramUsername>``` with the user that you want to get information about.

3. **Get my data**

To get data about your personal account, run the application with:

```node command.js myAccount```

Or

```node command.js m```

The response it would a JSON object in the Command Line with your data.