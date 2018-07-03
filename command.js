#!/usr/bin/env node

const program = require('commander');
const {prompt} = require('inquirer');
const {exportFollowersData,getMyData} = require('./logic');

console.log(__dirname);

program
    .version('0.0.1')
    .description('Instagram data retrieve')


program
    .command('exportData <instagramUser>')
    .alias('e')
    .description('Export followers data to a CSV file')
    .action(function(instagramUser){
        exportFollowersData(instagramUser);
    });

program
    .command('myAccount')
    .alias('m')
    .description('Get my personal data')
    .action(function(){
        getMyData();
    });


program.parse(process.argv);