/*
//-------------------------------------------
MMM-MyDutchWeather
Copyright (C) 2024 - H. Tilburgs
MIT License

v2.0.0 : New version
  - New look and feel
  - API 2.0 support weerlive.nl

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
            console.log(result); 
            // console.log(result.wk_verw['0']);
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
