const NodeHelper = require("node_helper");

module.exports = NodeHelper.create({
  start() {
    console.log(`Starting node_helper for: ${this.name}`);
  },

  async getMWB(url) {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Status: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();

      this.sendSocketNotification("MWB_RESULT", result);

    } catch (error) {
      console.error(`MMM-MyDutchWeather Error: ${error.message}`);

      // Send error to frontend
      this.sendSocketNotification("MWB_ERROR", error.message);
    }
  },

  socketNotificationReceived(notification, payload) {
    if (notification === "GET_MWB") {
      this.getMWB(payload);
    }
  },
});
