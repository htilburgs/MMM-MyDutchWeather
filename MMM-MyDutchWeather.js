/* 
//-------------------------------------------
MMM-MyDutchWeather
Copyright (C) 2019 - H. Tilburgs
MIT License
//-------------------------------------------
*/

Module.register("MMM-MyDutchWeather", {
  defaults: {
    latitude: null, // Latitude of your city
    longitude: null, // Longitude of your city
    apiKey: null, // API Key - Get for free at http://weerlive.nl/api/toegang/index.php
    showIcons: true, // Display Icons or Text
    showExtra: false, // Display additional weather information
    maxWidth: "500px", // Max width wrapper
    animationSpeed: 1000, // fade in and out speed
    initialLoadDelay: 1000,
    retryDelay: 2500,
    updateInterval: 10 * 60 * 1000, // Every 10 minutes
  },

  getStyles() {
    return ["MMM-MyDutchWeather.css", "weather-icons.css"];
  },

  getScripts() {
    return ["moment.js"];
  },

  getTranslations() {
    return {
      nl: "translations/nl.json",
      en: "translations/en.json",
      de: "translations/de.json",
    };
  },

  start() {
    Log.info(`Starting module: ${this.name}`);
    this.requiresVersion = "2.1.0";
    this.url = `https://weerlive.nl/api/json-data-10min.php?key=${this.config.apiKey}&locatie=${this.config.latitude},${this.config.longitude}`;
    this.MWB = {};
    this.loaded = false;
    this.scheduleUpdate();
  },

  getDom() {
    const wrapper = document.createElement("div");
    wrapper.className = "wrapper";
    wrapper.style.maxWidth = this.config.maxWidth;

    if (!this.loaded) {
      wrapper.innerHTML = "Loading...";
      wrapper.classList.add("bright", "light", "small");
      return wrapper;
    }

    const table = document.createElement("table");
    table.style.maxWidth = this.config.maxWidth;

    const createRow = (label, value, iconClass = null) => {
      const row = document.createElement("tr");

      const labelCell = document.createElement("td");
      labelCell.className = "small label-cell";
      labelCell.innerHTML = iconClass
        ? `<i class="${iconClass}"></i> ${label}`
        : label;
      row.appendChild(labelCell);

      const valueCell = document.createElement("td");
      valueCell.className = "small value-cell";
      valueCell.innerHTML = value;
      row.appendChild(valueCell);

      return row;
    };

    // Add rows dynamically
    table.appendChild(createRow("Plaats", this.MWB.plaats || "N/A"));
    table.appendChild(createRow("Temperatuur", `${this.MWB.temp} ℃`));
    table.appendChild(
      createRow(
        "Max Temp",
        `${this.MWB.d0tmax} ℃`,
        this.config.showIcons ? "wi wi-thermometer" : null
      )
    );
    table.appendChild(
      createRow(
        "Min Temp",
        `${this.MWB.d0tmin} ℃`,
        this.config.showIcons ? "wi wi-thermometer-exterior" : null
      )
    );
    table.appendChild(createRow("Samenvatting", this.MWB.samenv || "N/A"));

    if (this.config.showExtra) {
      table.appendChild(
        createRow(
          "Kans op Neerslag",
          `${this.MWB.d0neerslag || 0} %`,
          this.config.showIcons ? "wi wi-umbrella" : null
        )
      );
      table.appendChild(
        createRow(
          "Kans op Zon",
          `${this.MWB.d0zon || 0} %`,
          this.config.showIcons ? "wi wi-day-sunny" : null
        )
      );
      table.appendChild(
        createRow(
          "Windrichting",
          this.MWB.windr || "N/A",
          this.config.showIcons ? "wi wi-wind-direction" : null
        )
      );
      table.appendChild(
        createRow(
          "Windsnelheid",
          `${this.MWB.winds || 0} Bft`,
          this.config.showIcons ? "wi wi-strong-wind" : null
        )
      );
      table.appendChild(
        createRow(
          "Luchtdruk",
          `${this.MWB.luchtd || 0} hPa`,
          this.config.showIcons ? "wi wi-barometer" : null
        )
      );
      table.appendChild(
        createRow(
          "Zicht",
          `${this.MWB.zicht || 0} KM`,
          this.config.showIcons ? "far fa-eye" : null
        )
      );
      table.appendChild(
        createRow(
          "Vochtigheid",
          `${this.MWB.lv || 0} %`,
          this.config.showIcons ? "wi wi-humidity" : null
        )
      );
    }

    // Footer
    const footerRow = document.createElement("tr");
    footerRow.className = "footer";
    footerRow.innerHTML = "KNMI Weergegevens via Weerlive.nl";
    table.appendChild(footerRow);

    wrapper.appendChild(table);
    return wrapper;
  },

  processMWB(data) {
    this.MWB = data;
    this.loaded = true;
    this.updateDom(this.config.animationSpeed);
  },

  scheduleUpdate() {
    setInterval(() => {
      this.getMWB();
    }, this.config.updateInterval);
    this.getMWB();
  },

  getMWB() {
    this.sendSocketNotification("GET_MWB", this.url);
  },

  socketNotificationReceived(notification, payload) {
    if (notification === "MWB_RESULT") {
      this.processMWB(payload);
    }
  },
});
