#!/usr/bin/env node

const program = require('commander');
const {prompt} = require('inquirer');

console.log(__dirname);

program
    .version('0.0.1')
    .description('Instagram data retrieve')

program.parse(process.argv);