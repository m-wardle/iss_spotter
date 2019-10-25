const request = require('request-promise-native');

const fetchMyIP = function() {
  let url = "https://api.ipify.org?format=json";
  return request(url);
}

const fetchCoordsByIP = function(body) {
  const ip = JSON.parse(body).ip;
  return request(`https://ipvigilante.com/json/${ip}`);
};

const fetchISSFlyoverTimes = function(body) {
  const { latitude, longitude } = JSON.parse(body).data;
  return request(`http://api.open-notify.org/iss-pass.json?lat=${latitude}&lon=${longitude}`)
}

const nextISSTimesForMyLocation = function() {
  return fetchMyIP()
    .then(fetchCoordsByIP)
    .then(fetchISSFlyoverTimes)
    .then((body) => {
      const { response } = JSON.parse(body);
      return response
    })
}

module.exports = {
  nextISSTimesForMyLocation
}