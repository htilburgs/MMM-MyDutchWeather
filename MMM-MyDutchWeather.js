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
        latitude: null,
        longitude: null,
        apiKey: null,
        showIcons: true,
        showExtra: false,
        maxWidth: "500px",
        animationSpeed: 1000,
        initialLoadDelay: 1000,
        retryDelay: 2500,
        updateInterval: 10 * 60 * 1000 // Every 10 minutes
    },

    // Define stylesheet
    getStyles() {
        return ["MMM-MyDutchWeather.css", "weather-icons.css"];
    },

    // Define required scripts
    getScripts() {
        return ["moment.js"];
    },

    // Define required translations
    getTranslations() {
        return {
            nl: "translations/nl.json",
            en: "translations/en.json",
            de: "translations/de.json"
        };
    },

    start() {
        Log.info(`Starting module: ${this.name}`);
        this.requiresVersion = "2.1.0";
        this.url = `https://weerlive.nl/api/weerlive_api_v2.php?key=${this.config.apiKey}&locatie=${this.config.latitude},${this.config.longitude}`;
        this.MWB = [];
        this.scheduleUpdate();
        this.loaded = false;
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

        const { MWB } = this;
        const { liveweer: WL, uur_verw: WH, wk_verw: WW, api: API } = MWB;

        const table = document.createElement("table");
        table.style.maxWidth = this.config.maxWidth;

        const createRow = (className, content) => {
            const row = document.createElement("tr");
            row.className = className;
            row.innerHTML = content;
            return row;
        };

        const createCell = (className, content) => {
            const cell = document.createElement("td");
            cell.className = className;
            cell.innerHTML = content;
            return cell;
        };

        // Add location and temperature
        const WoonplaatsRow = createRow("woonplaats-row", "");
        WoonplaatsRow.appendChild(createCell("normal woonplaatstextcell", WL[0].plaats));
        WoonplaatsRow.appendChild(createCell("normal temptextcell", `${WL[0].temp} ℃`));
        table.appendChild(WoonplaatsRow);

        // Add min and max temperature
        const MinMaxTempRow = createRow("minmaxtemp-row", "");
        MinMaxTempRow.appendChild(createCell(
            "small maxtempdatacell",
            this.config.showIcons
                ? `<i class="wi wi-thermometer"></i>&nbsp;${WW[0].max_temp} ℃`
                : `(Max) ${WW[0].max_temp} ℃`
        ));
        MinMaxTempRow.appendChild(createCell(
            "small mintempdatacell",
            this.config.showIcons
                ? `<i class="wi wi-thermometer-exterior"></i>&nbsp;${WW[0].min_temp} ℃`
                : `(Min) ${WW[0].min_temp} ℃`
        ));
        table.appendChild(MinMaxTempRow);

        // Add current weather summary
        const HuidigRow = createRow("huidig-row", "");
        HuidigRow.appendChild(createCell("small huidigcell", WL[0].samenv));
        table.appendChild(HuidigRow);

        // Add extra information if enabled
        if (this.config.showExtra) {
            const extraInfo = [
                { icon: "umbrella", text: "RAINFALL-CHANCE", value: `${WW[0].neersl_perc_dag} %` },
                { icon: "day-sunny", text: "SUN-CHANCE", value: `${WW[0].zond_perc_dag} %` },
                { icon: "wind-direction", text: "WIND-DIR", value: WW[0].windr },
                { icon: "strong-wind", text: "WIND-FORCE", value: `${WW[0].windkmh} Kmh` },
                { icon: "barometer", text: "AIR-PRESS", value: WL[0].luchtd },
                { icon: "fa-solid fa-eye", text: "VISIBILITY", value: `${WL[0].zicht} KM` },
                { icon: "humidity", text: "AIR-MOIST", value: `${WL[0].lv} %` },
                { icon: "sunrise", text: "SUNUP", value: WL[0].sup },
                { icon: "sunset", text: "SUNDOWN", value: WL[0].sunder }
            ];

            extraInfo.forEach(info => {
                const row = createRow(`${info.text.toLowerCase()}-row`, "");
                row.appendChild(
                    createCell(
                        `small ${info.text.toLowerCase()}textcell`,
                        this.config.showIcons
                            ? `<i class="wi wi-${info.icon}"></i>`
                            : this.translate(info.text)
                    )
                );
                row.appendChild(createCell(`small ${info.text.toLowerCase()}datacell`, info.value));
                table.appendChild(row);
            });
        }

        // Add footer
        table.appendChild(createRow("footer", API[0].bron));

        return table;
    },

    processMWB(data) {
        this.MWB = data;
        this.loaded = true;
    },

    scheduleUpdate() {
        setInterval(() => this.getMWB(), this.config.updateInterval);
        this.getMWB();
    },

    getMWB() {
        this.sendSocketNotification('GET_MWB', this.url);
    },

    socketNotificationReceived(notification, payload) {
        if (notification === "MWB_RESULT") {
            this.processMWB(payload);
        }
        this.updateDom(this.config.animationSpeed);
    }
});
