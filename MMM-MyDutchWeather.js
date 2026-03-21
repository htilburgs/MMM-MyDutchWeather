Module.register('MMM-MyDutchWeather', {

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
        updateInterval: 10 * 60 * 1000
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
            de: "translations/de.json"
        };
    },

    start() {
        Log.info(`Starting module: ${this.name}`);
        this.requiresVersion = "2.1.0";

        // Config validation
        if (!this.config.apiKey || !this.config.latitude || !this.config.longitude) {
            Log.error("MMM-MyDutchWeather: Missing apiKey, latitude or longitude!");
            this.error = "Missing configuration";
            this.loaded = true;
            return;
        }

        this.url = `https://weerlive.nl/api/weerlive_api_v2.php?key=${this.config.apiKey}&locatie=${this.config.latitude},${this.config.longitude}`;

        this.MWB = [];
        this.loaded = false;
        this.error = null;

        this.scheduleUpdate();
    },

    getDom() {
        const wrapper = document.createElement("div");
        wrapper.className = "wrapper";
        wrapper.style.maxWidth = this.config.maxWidth;

        if (this.error) {
            wrapper.innerHTML = `Error: ${this.error}`;
            wrapper.classList.add("bright", "light", "small");
            return wrapper;
        }

        if (!this.loaded) {
            wrapper.innerHTML = "Loading....";
            wrapper.classList.add("bright", "light", "small");
            return wrapper;
        }

        const { liveweer: WL, wk_verw: WW, api: API } = this.MWB;

        const current = WL[0];
        const today = WW[0];

        const table = document.createElement("table");
        table.style.maxWidth = this.config.maxWidth;

        const createRow = (className) => {
            const row = document.createElement("tr");
            row.className = className;
            return row;
        };

        const createCell = (className, content) => {
            const cell = document.createElement("td");
            cell.className = className;
            cell.innerHTML = content;
            return cell;
        };

        // Location + current temperature
        const row1 = createRow("woonplaats-row");
        row1.appendChild(createCell("normal woonplaatstextcell", current.plaats));
        row1.appendChild(createCell("normal temptextcell", `${current.temp} ℃`));
        table.appendChild(row1);

        // Min / Max temperature
        const row2 = createRow("minmaxtemp-row");
        row2.appendChild(createCell(
            "small maxtempdatacell",
            this.config.showIcons
                ? `<i class="wi wi-thermometer"></i> ${today.max_temp} ℃`
                : `(Max) ${today.max_temp} ℃`
        ));
        row2.appendChild(createCell(
            "small mintempdatacell",
            this.config.showIcons
                ? `<i class="wi wi-thermometer-exterior"></i> ${today.min_temp} ℃`
                : `(Min) ${today.min_temp} ℃`
        ));
        table.appendChild(row2);

        // Current weather summary
        const row3 = createRow("huidig-row");
        row3.appendChild(createCell("small huidigcell", current.samenv));
        table.appendChild(row3);

        // Extra info
        if (this.config.showExtra) {

            // Spacer row (valid HTML)
            const spacerRow = document.createElement("tr");
            spacerRow.innerHTML = "<td colspan='2'>&nbsp;</td>";
            table.appendChild(spacerRow);

            const extraInfo = [
                { icon: "umbrella", text: "RAINFALL-CHANCE", value: `${today.neersl_perc_dag} %` },
                { icon: "day-sunny", text: "SUN-CHANCE", value: `${today.zond_perc_dag} %` },
                { icon: "wind-direction", text: "WIND-DIR", value: today.windr },
                { icon: "strong-wind", text: "WIND-FORCE", value: `${today.windkmh} km/h` },
                { icon: "barometer", text: "AIR-PRESS", value: current.luchtd },
                { icon: "alien", text: "VISIBILITY", value: `${current.zicht} km` },
                { icon: "humidity", text: "AIR-MOIST", value: `${current.lv} %` },
                { icon: "sunrise", text: "SUNUP", value: current.sup },
                { icon: "sunset", text: "SUNDOWN", value: current.sunder }
            ];

            extraInfo.forEach(info => {
                const row = createRow(`${info.text.toLowerCase()}-row`);
                row.appendChild(createCell(
                    `small ${info.text.toLowerCase()}textcell`,
                    this.config.showIcons
                        ? `<i class="wi wi-${info.icon}"></i>`
                        : this.translate(info.text)
                ));
                row.appendChild(createCell(`small ${info.text.toLowerCase()}datacell`, info.value));
                table.appendChild(row);
            });
        }

        // Footer spanning 2 columns
        const footer = createRow("footer");
        const footerCell = document.createElement("td");
        footerCell.className = "footer-cell";
        footerCell.colSpan = 2;
        footerCell.innerHTML = API[0].bron;
        footer.appendChild(footerCell);
        table.appendChild(footer);

        return table;
    },

    processMWB(data) {
        this.MWB = data;
        this.loaded = true;
        this.error = null;
    },

    scheduleUpdate() {
        this.timer = setInterval(() => this.getMWB(), this.config.updateInterval);
        this.getMWB();
    },

    suspend() {
        if (this.timer) clearInterval(this.timer);
    },

    resume() {
        this.scheduleUpdate();
    },

    getMWB() {
        this.sendSocketNotification('GET_MWB', this.url);
    },

    socketNotificationReceived(notification, payload) {
        if (notification === "MWB_RESULT") {
            this.processMWB(payload);
        } else if (notification === "MWB_ERROR") {
            this.error = payload;
            this.loaded = true;
        }
        this.updateDom(this.config.animationSpeed);
    }
});
