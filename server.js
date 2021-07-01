const express = require('express');
const puppeteer = require('puppeteer');
const app = express();
const port = 3000;

const searchGoogle = require('./index.js'); //Runs index.js first


let json = require('/Users/lollipoptart/Desktop/PUPETEER-REST/data2.json');  //Reads the JSON File

//Catches requests made to localhost:3000/
app.get('/stories', (req, res) => res.send(json));


//Initialises the express server on the port 30000
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
