/*
//-------------------------------------------
MMM-MyDutchWeather
Copyright (C) 2024 - H. Tilburgs
MIT License

v2.0.0 - 12-11-2024 - API 2.0
//-------------------------------------------
*/

Module.register('MMM-MyDutchWeather', {
    // Default values
    defaults: {
        latitude: null, // Latitude of your city
        longitude: null, // Longitude of your city
        apiKey: null, // API Key - Get for free at http://weerlive.nl/api/toegang/index.php
        showIcons: true, // Display Icons or Text
        showExtra: false, // Display additional weather information
        maxWidth: "500px", // Max width wrapper
        animationSpeed: 1000, // Fade in and out speed
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
        this.url = `https://weerlive.nl/api/weerlive_api_v2.php?key=${this.config.apiKey}&locatie=${this.config.latitude},${this.config.longitude}`;
        this.MWB = []; // Data storage
        this.loaded = false; // Loading state
        this.scheduleUpdate();
    },

    getDom() {
        const wrapper = document.createElement("div");
        wrapper.className = "wrapper";
        wrapper.style.maxWidth = this.config.maxWidth;

        if (!this.loaded) {
            wrapper.innerHTML = "Loading....";
            wrapper.classList.add("bright", "light", "small");
            return wrapper;
        }

        const table = document.createElement("table");
        table.style.maxWidth = this.config.maxWidth;

        // Data
        const { liveweer: currentWeather, wk_verw: weeklyForecast, api } = this.MWB;

        // Add rows
        this.addRow(table, "woonplaats-row", [
            { content: currentWeather[0].plaats, className: "woonplaatstextcell normal" },
            { content: `${currentWeather[0].temp} ℃`, className: "temptextcell normal" },
        ]);

        this.addRow(table, "minmaxtemp-row", [
            {
                content: this.config.showIcons
                    ? `<i class="wi wi-thermometer"></i> ${weeklyForecast[0].max_temp} ℃`
                    : `(Max) ${weeklyForecast[0].max_temp} ℃`,
                className: "maxtempdatacell small",
            },
            {
                content: this.config.showIcons
                    ? `<i class="wi wi-thermometer-exterior"></i> ${weeklyForecast[0].min_temp} ℃`
                    : `(Min) ${weeklyForecast[0].min_temp} ℃`,
                className: "mintempdatacell small",
            },
        ]);

        this.addRow(table, "huidig-row", [
            { content: currentWeather[0].samenv, className: "huidigcell small" },
        ]);

        // Footer
        this.addRow(table, "footer", [{ content: api[0].bron }]);

        wrapper.appendChild(table);
        return wrapper;
    },

    addRow(table, rowClass, cells) {
        const row = document.createElement("tr");
        row.className = rowClass;

        cells.forEach(({ content, className }) => {
            const cell = document.createElement("td");
            cell.className = className || "";
            cell.innerHTML = content || "";
            row.appendChild(cell);
        });

        table.appendChild(row);
    },

    processMWB(data) {
        this.MWB = data;
        this.loaded = true;
        this.updateDom(this.config.animationSpeed);
    },

    scheduleUpdate() {
        setInterval(() => this.getMWB(), this.config.updateInterval);
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
