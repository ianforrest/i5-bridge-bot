const http = require('http');
const axios = require('axios')
require('dotenv').config();
const { resolve } = require('path');
const accessCode = process.env.ACCESS_CODE;
const url = "http://www.wsdot.wa.gov/Traffic/api/HighwayAlerts/HighwayAlertsREST.svc/GetAlertsAsJson?AccessCode="+accessCode;
var tweet = require('./twitter')

const server = http.createServer((req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/html')
  res.end('<h1>Hello, World!</h1>')
})

server.listen(process.env.PORT || 3000, () => {
  console.log(`Server running at port ${process.env.PORT || 3000}`)
  setInterval(apiCall, 60100);
  bridgeTimer();
})


const testTrafficData = [{
  "AlertID":454706,
  "County":null,
  "EndRoadwayLocation":{
     "Description":null,
     "Direction":"B",
     "Latitude":0,
     "Longitude":0,
     "MilePost":0,
     "RoadName":"012"
  },
  "EndTime":"\/Date(1622314800000-0700)\/",
  "EventCategory":"Special Event",
  "EventStatus":"Open",
  "ExtendedDescription":"",
  "HeadlineDescription":"US 12 milepost 367 Dayton: Saturday May 29 between 10 a.m. and noon, expect detours in Dayton for a local community event.",
  "LastUpdatedTime":"\/Date(1622095407710-0700)\/",
  "Priority":"Lowest",
  "Region":"South Central",
  "StartRoadwayLocation":{
     "Description":null,
     "Direction":"B",
     "Latitude":46.318434132,
     "Longitude":-117.983402861,
     "MilePost":367.00,
     "RoadName":"012"
  },
  "StartTime":"\/Date(1621874520000-0700)\/"
}]

var bridgeData = []

const apiCall = () => {   
  axios.get(url)
  .then(res => {
    const headerDate = res.headers && res.headers.date ? res.headers.date : 'no response date';
    console.log('API Call Status Code:', res.status);
    console.log('Date in Response header:', headerDate);
    // console.log(res.data[0].StartTime);
    // var testStartTime = Number(res.data[0].StartTime.replace('/Date(', '').replace('-0700)/', ''));
    // console.log(testStartTime);

    // var date = new Date(testStartTime);
    // console.log(date.toLocaleTimeString());
    
    bridgeData = res.data.filter(({Region}) => {
      return Region === "Southwest"
    }).filter(({EventCategory}) => {
      return EventCategory === "Bridge Lift"
    });
  })
  .catch(err => {
    console.log('Error: ', err.message);
  });
}

// Every 70 seconds, check the data living in bridgeData. If bridge data length
// is more than zero, then trigger action. If action is triggered, stop this timer.

function bridgeTimer () {
  bridgeTimer = setInterval(bridgeUpCheck, 70100);
}

const bridgeUpCheck = () => {
  if (bridgeData.length >= 1) {
    bridgeUpAction();
  } else {
    console.log("Bridge is down. Traffic is flowing.")
  }
}

const bridgeUpAction = () => {
  console.log("Stopping the bridge timer.");
  clearInterval(bridgeTimer);
  console.log(bridgeData);
  var getStartTime = Number(
    bridgeData[0].StartTime.replace('/Date(', '').replace('-0700)/', '')
  );
  var date = new Date(getStartTime).toLocaleTimeString();
  console.log("Bridge is up starting at " + date);
  tweet();
  bridgeDownTimer();

}

const bridgeDownTimer = () => {
  setInterval(bridgeDownCheck, 100000)
}

const bridgeDownCheck = () => {
  if (bridgeData.length >= 1) {
    console.log("Bridge is still up.")
  } else {
    clearInterval(bridgeDownTimer);
    bridgeTimer();
  }
}