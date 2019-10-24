const request = require("request");

const fetchMyIP = function(callback) {
  let url = "https://api.ipify.org?format=json";
  request(url, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    const ip = JSON.parse(body).ip;
    callback(null, ip);
    return;
  });
};

const fetchCoordsByIP = function(ip, callback) {
  let url = "https://ipvigilante.com/" + ip;
  request(url, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching Coords. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    const bodyObj = JSON.parse(body);
    
    let coords = {
      latitude: bodyObj.data.latitude,
      longitude: bodyObj.data.longitude
    };
    
    callback(null, coords);
    return;
  
  });
};

const fetchISSFlyOverTimes = function(coords, callback) {
  let url = `http://api.open-notify.org/iss-pass.json?lat=${coords.latitude}&lon=${coords.longitude}`;
  request(url, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
    // if non-200 status, assume server error
    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching ISS flyover times. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    const bodyObj = JSON.parse(body);
    
    let times = bodyObj.response;
    
    callback(null, times);
    return;
  
  });
};

const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      console.log("It didn't work!" , error);
      return;
    }
  
    // console.log('It worked! Returned IP:' , ip)
    
    fetchCoordsByIP(ip, (error, coords) => {
      if (error) {
        console.log("It didn't work!" , error);
        return;
      }
    
      // console.log('It worked! Returned Coords:' , coords);
      
      fetchISSFlyOverTimes(coords, callback);
    });
  });
};

module.exports = {
  fetchMyIP,
  fetchCoordsByIP,
  fetchISSFlyOverTimes,
  nextISSTimesForMyLocation
};