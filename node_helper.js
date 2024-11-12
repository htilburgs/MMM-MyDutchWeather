/*
//-------------------------------------------
MMM-MyDutchWeather
Copyright (C) 2024 - H. Tilburgs
MIT License

v2.0.0 - 12-11-2024 - API 2.0
//-------------------------------------------
*/

const NodeHelper = require('node_helper');

module.exports = NodeHelper.create({

  start: function() {
          console.log("Starting node_helper for: " + this.name);
  },

getMWB: function(url) {
        // Make a GET request using the Fetch API
        fetch(url)
          .then(response => {
            if (!response.ok) {
              console.error('MMM-MyDutchWeather: Network response was not ok');
            }
            return response.json();
          })

          .then(result => {
            // Process the retrieved user data
            console.log(result); // Remove trailing slashes to display data in Console for testing
            this.sendSocketNotification('MWB_RESULT', result);
          })

          .catch(error => {
            console.error('Error:', error);
          });
  },

  socketNotificationReceived: function(notification, payload) {
            if (notification === 'GET_MWB') {
            this.getMWB(payload);
            }
  },

});
