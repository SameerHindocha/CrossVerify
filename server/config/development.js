var config = {
  "mongo": {
    "dbHost": [{ "host": "127.0.0.1", "port": 27017 }],
    "dbName": "CrossVerify",
    "dbUser": "",
    "dbPassword": "",
    "debug": true
  },
  "server": {
    "url": "localhost",
    "port": "8020"
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
    "username": "tapasvi.vaghela@rapidops.com",
    "password": "t7600434720",
    "fromAddress": "tapasvi.vaghela@rapidops.com"
  }
}
module.exports = config;