var config = {
  "mongo": {
    "dbHost": [{ "host": "127.0.0.1", "port": 27017 }],
    "dbName": "CrossVerify",
    "dbUser": "",
    "dbPassword": "",
    "debug": true
  },
  "server": {
    "url": "120.72.91.62",
    "port": "8082"
    // "prodServerHost": "",
    // "prodServerPort": "8082"
  },
  "gupShupSMS": {
    "userId": "2000144979",
    "password": "etXCalqSL"
  },
  "mailServer": {
    "host": "smtp.gmail.com",
    "port": 465,
    "secure": true,
    "debug": true,
    // "username": " tapasvi.vaghela@rapidops.com",
    "username": "crossverify.com@gmail.com",
    // "password": "t7600434720",
    "password": "crossverify101",
    // "fromAddress": "tapasvi.vaghela@rapidops.com"
    "fromAddress": "crossverify.com@gmail.com"
  }
}
module.exports = config;