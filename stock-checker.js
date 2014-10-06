var request = require('request');
var cheerio = require('cheerio');
var fs      = require('fs');


//Prepends leading 0 if n < 10
function pad(n) {
    return (n < 10) ? ("0" + n) : n;
}


function logString(string) {
  var currentDate = new Date();
  var currentDay = currentDate.getDate();
  var currentMonth = currentDate.getMonth() + 1;
  var currentYear = currentDate.getFullYear();
  var currentHour = currentDate.getHours();
  var currentMinute = currentDate.getMinutes();
  var currentSecond = currentDate.getSeconds();
  var currentTimeString = pad(currentDay) + "/" + pad(currentMonth) + "/" + currentYear + " " + pad(currentHour) + ":" + pad(currentMinute) + ":" + pad(currentSecond);

  var logString = currentTimeString + " - " + string + "\n";
  fs.appendFile('log.txt', logString);
}


function checkStock() {

  // Set request parameters
  var options = {
    url: url,
    headers: {
      'User-Agent' : 'request'
    }
  };

  // Begin request
  request.get(options, function(error, response, body) {

    // If request is successful
    if (!error) {
      $ = cheerio.load(body);
      var stock = $('.mod-stock-availability').attr('data-jl-stock');
      var logData = itemName + ' John Lewis stock: ' + stock;
      logString(logData);

      if (stock > 0) {
        var title = itemName + ' is in stock!';
        var message = stock.toString() + " available - GO BUY ONE! " + url;
        sendPushover(title, message);
      }

    } else {
      // Log request errors
      var logData = 'Error: ' + error;
      logString(logData);
    }
  });
}


function sendPushover(title, message) {
  var sound = 'persistent';
  var data = {
    token   : pushoverToken,
    user    : pushoverUser,
    title   : title,
    message : message,
    sound   : sound
  };
  var options = {
    url: 'https://api.pushover.net/1/messages.json',
    form: data
  };
  request.post(options, function(error, response, body){
    if (error) {
      logData = "Error sending notification: " + err;
      logString(logData);
      sendPushover(title, message);
    } else {
      logData = "Notification sent: [TITLE: '" + title + "'], [MESSAGE: '" + message + "'], [SOUND: '" + sound + "']";
      logString(logData);
    }
  });
}

var config = JSON.parse(fs.readFileSync('config.json'));
var url = config['url'];
var itemName = config['itemName'];
var interval = config['interval'];
var pushoverKeys = config['pushover'];
var pushoverToken = pushoverKeys['token'];
var pushoverUser = pushoverKeys['group'];

checkStock();

setInterval(function (){
  checkStock();
}, interval);
