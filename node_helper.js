/*
//-------------------------------------------
MMM-MyDutchWeather
Copyright (C) 2019 - H. Tilburgs
MIT License
//-------------------------------------------
*/

const NodeHelper = require('node_helper');
const request = require('request');

module.exports = NodeHelper.create({

  start: function() {
          console.log("Starting node_helper for: " + this.name);
  },

  getMWB: function(url) {
	request({
	url: url,
	method: 'GET'
	}, 
	(error, response, body) => {
		if (!error && response.statusCode == 200) {
		var result = JSON.parse(body).liveweer['0'];			// JSON data path - object.liveweer.0
		console.log(response.statusCode + result);				// uncomment to see in terminal
		this.sendSocketNotification('MWB_RESULT', result);
		}
        });
    },

  socketNotificationReceived: function(notification, payload) {
            if (notification === 'GET_MWB') {
            this.getMWB(payload);
            }
  }
});
