/*
//-------------------------------------------
MMM-MyDutchWeather
Copyright (C) 2019 - H. Tilburgs
MIT License

v1.0 : Initial version
v2.0 : Update request to fetch (request package has been deprecated)

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
            console.log(result.liveweer['0']); // Remove trailing slashes to display data in Console for testing
            this.sendSocketNotification('MWB_RESULT', result.liveweer['0']);
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
