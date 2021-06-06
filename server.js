const http = require('http');
const axios = require('axios')
const fetch = require("node-fetch");
require('dotenv').config();
const { resolve } = require('path');
const accessCode = process.env.ACCESS_CODE;
const url = "http://www.wsdot.wa.gov/Traffic/api/HighwayAlerts/HighwayAlertsREST.svc/GetAlertsAsJson?AccessCode="+accessCode;

const server = http.createServer((req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'text/html')
  res.end('<h1>Hello, World!</h1>')
})

server.listen(process.env.PORT || 3000, () => {
  console.log(`Server running at port ${process.env.PORT || 3000}`)
  
  setInterval (apiCall, 60000);




})

const apiCall = () => {   
  axios.get(url)
  .then(res => {
    const headerDate = res.headers && res.headers.date ? res.headers.date : 'no response date';
    console.log('Status Code:', res.status);
    console.log('Date in Response header:', headerDate);

    const filteredAlerts = res.data.filter(({Region}) => {
      return Region === "Southwest"
    }).filter(({EventCategory}) => {
      return EventCategory === "Bridge Lift"
    });
    console.log(filteredAlerts);

    if (filteredAlerts.length >= 1) {
      console.log("Bridge is up.")
    } else {
      console.log("Bridge is down. Traffic is flowing.")
    }

    return filteredAlerts
  
  })
  .catch(err => {
    console.log('Error: ', err.message);
  });
}
