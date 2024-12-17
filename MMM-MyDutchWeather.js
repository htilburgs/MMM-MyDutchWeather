getDom() {
    const wrapper = document.createElement("div");
    wrapper.className = "wrapper";
    wrapper.style.maxWidth = this.config.maxWidth;

    if (!this.loaded) {
        wrapper.innerHTML = "Loading....";
        wrapper.classList.add("bright", "light", "small");
        return wrapper;
    }

    const { liveweer: WL, wk_verw: WW, api: API } = this.MWB;

    // Check if data exists
    if (!WL || !WL[0] || !WW || !WW[0]) {
        wrapper.innerHTML = "Weather data unavailable.";
        wrapper.classList.add("bright", "light", "small");
        return wrapper;
    }

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
    const locationRow = createRow("woonplaats-row", "");
    locationRow.appendChild(createCell("normal woonplaatstextcell", WL[0].plaats || "N/A"));
    locationRow.appendChild(createCell("normal temptextcell", `${WL[0].temp || "N/A"} ℃`));
    table.appendChild(locationRow);

    // Add min and max temperature
    const minMaxTempRow = createRow("minmaxtemp-row", "");
    minMaxTempRow.appendChild(createCell(
        "small maxtempdatacell",
        this.config.showIcons
            ? `<i class="wi wi-thermometer"></i>&nbsp;${WW[0].max_temp || "N/A"} ℃`
            : `(Max) ${WW[0].max_temp || "N/A"} ℃`
    ));
    minMaxTempRow.appendChild(createCell(
        "small mintempdatacell",
        this.config.showIcons
            ? `<i class="wi wi-thermometer-exterior"></i>&nbsp;${WW[0].min_temp || "N/A"} ℃`
            : `(Min) ${WW[0].min_temp || "N/A"} ℃`
    ));
    table.appendChild(minMaxTempRow);

    // Add current weather summary
    const summaryRow = createRow("huidig-row", "");
    summaryRow.appendChild(createCell("small huidigcell", WL[0].samenv || "N/A"));
    table.appendChild(summaryRow);

    // Add extra information if enabled
    if (this.config.showExtra) {
        const extraInfo = [
            { icon: "umbrella", text: "RAINFALL-CHANCE", value: `${WW[0].neersl_perc_dag || "N/A"} %` },
            { icon: "day-sunny", text: "SUN-CHANCE", value: `${WW[0].zond_perc_dag || "N/A"} %` },
            { icon: "wind-direction", text: "WIND-DIR", value: WW[0].windr || "N/A" },
            { icon: "strong-wind", text: "WIND-FORCE", value: `${WW[0].windbft || "N/A"} Bft` },
            { icon: "barometer", text: "AIR-PRESS", value: WL[0].luchtd || "N/A" },
            { icon: "far fa-eye", text: "VISIBILITY", value: `${WL[0].zicht || "N/A"} KM` },
            { icon: "humidity", text: "AIR-MOIST", value: `${WL[0].lv || "N/A"} %` },
            { icon: "sunrise", text: "SUNUP", value: WL[0].sup || "N/A" },
            { icon: "sunset", text: "SUNDOWN", value: WL[0].sunder || "N/A" }
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
    table.appendChild(createRow("footer", API[0]?.bron || "N/A"));

    return table;
}
