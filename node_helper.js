/*
MMM-MyDutchWeather
Copyright (C) 2024 - H. Tilburgs
MIT License

v2.0.0 - 12-11-2024 - API 2.0
*/

const NodeHelper = require("node_helper");

module.exports = NodeHelper.create({
  start() {
    console.log(`Starting node_helper for: ${this.name}`);
  },

  async getMWB(url) {
    try {
      // Maak een GET-aanroep naar de opgegeven URL
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(
          `MMM-MyDutchWeather: Network response was not ok. Status: ${response.status} ${response.statusText}`
        );
      }

      const result = await response.json();

      // Stuur de ontvangen gegevens naar de module
      this.sendSocketNotification("MWB_RESULT", result);
    } catch (error) {
      console.error(`MMM-MyDutchWeather Error: ${error.message}`);
    }
  },

  socketNotificationReceived(notification, payload) {
    if (notification === "GET_MWB") {
      // Start de API-aanroep met de payload (URL)
      this.getMWB(payload);
    }
  },
});
