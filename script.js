const locations = {
    manali: {
        name: "Manali, Himachal Pradesh",
        latitude: 32.2396,
        longitude: 77.1887
    },
    shimla: {
        name: "Shimla, Himachal Pradesh",
        latitude: 31.1048,
        longitude: 77.1734
    },
    darjeeling: {
        name: "Darjeeling, West Bengal",
        latitude: 27.0410,
        longitude: 88.2663
    },
    gangtok: {
        name: "Gangtok, Sikkim",
        latitude: 27.3389,
        longitude: 88.6065
    },
    srinagar: {
        name: "Srinagar, Jammu & Kashmir",
        latitude: 34.0837,
        longitude: 74.7973
    },
    dehradun: {
        name: "Dehradun, Uttarakhand",
        latitude: 30.3165,
        longitude: 78.0322
    }
};

function updateCurrentRisk(rainfall, soilMoisture, temperature) {
    const riskLevel = document.querySelector(".risk-level");
    const warningMessage = document.querySelector(".warning-message");

    updateRiskDashboard(rainfall);
    updateRisk(rainfall);

    if (!riskLevel || !warningMessage) {
        return;
    }

    let score = 0;

    if (rainfall >= 100) {
        score += 50;
    } else if (rainfall >= 50) {
        score += 30;
    } else if (rainfall >= 20) {
        score += 15;
    }

    if (soilMoisture >= 0.7) {
        score += 30;
    } else if (soilMoisture >= 0.4) {
        score += 15;
    }

    if (temperature >= 25) {
        score += 20;
    } else if (temperature >= 15) {
        score += 10;
    }

    score = Math.min(score, 100);
    riskLevel.textContent = `🌋 ${score}/100`;
    updateAlertBanner(score);
    updateRegionalWarning(locationSelect?.value || "manali", score);

    if (score >= 70) {
        riskLevel.className = "risk-level risk-high";
        warningMessage.textContent =
            "🔴 HIGH RISK — Take precautions and follow local authority warnings.";
    } else if (score >= 40) {
        riskLevel.className = "risk-level risk-medium";
        warningMessage.textContent =
            "🟡 MEDIUM RISK — Stay alert and monitor weather conditions.";
    } else {
        riskLevel.className = "risk-level risk-low";
        warningMessage.textContent =
            "🟢 LOW RISK — Continue monitoring weather updates.";
    }

    updateSafetyAdvice(rainfall);
}

function calculateRisk(rainfall, forecastRain, historicalRain) {
    let riskScore = 0;

    if (rainfall >= 100) {
        riskScore += 40;
    } else if (rainfall >= 50) {
        riskScore += 25;
    } else if (rainfall >= 20) {
        riskScore += 10;
    }

    if (forecastRain >= 100) {
        riskScore += 35;
    } else if (forecastRain >= 50) {
        riskScore += 20;
    } else if (forecastRain >= 20) {
        riskScore += 10;
    }

    if (historicalRain >= 100) {
        riskScore += 25;
    } else if (historicalRain >= 50) {
        riskScore += 15;
    }

    let riskLevel;

    if (riskScore >= 70) {
        riskLevel = "HIGH";
    } else if (riskScore >= 35) {
        riskLevel = "MODERATE";
    } else {
        riskLevel = "LOW";
    }

    return {
        score: riskScore,
        level: riskLevel
    };
}

function updateRiskDashboard(rainfall) {
    const rainfallValue = document.getElementById("dashboard-rainfall");
    const rainfallStatus = document.getElementById("dashboard-rainfall-status");
    const slopeRisk = document.getElementById("dashboard-slope-risk");
    const slopeStatus = document.getElementById("dashboard-slope-status");
    const overallTitle = document.querySelector(".overall-risk h2");
    const overallText = document.querySelector(".overall-risk span");

    if (!rainfallValue || !rainfallStatus || !slopeRisk || !slopeStatus || !overallTitle || !overallText) {
        return;
    }

    rainfallValue.textContent = `${Number(rainfall).toFixed(0)} mm`;

    if (rainfall >= 100) {
        rainfallStatus.textContent = "Very heavy rainfall detected";
        slopeRisk.textContent = "HIGH";
        slopeStatus.textContent = "Increased landslide possibility";
        overallTitle.textContent = "🔴 HIGH RISK";
        overallText.textContent = "Very heavy rainfall. Stay alert and avoid unstable slopes.";
    } else if (rainfall >= 50) {
        rainfallStatus.textContent = "Heavy rainfall detected";
        slopeRisk.textContent = "MODERATE";
        slopeStatus.textContent = "Monitor changing slope conditions";
        overallTitle.textContent = "🟡 MODERATE RISK";
        overallText.textContent = "Heavy rainfall possible. Monitor weather and local alerts.";
    } else {
        rainfallStatus.textContent = "Light rainfall detected";
        slopeRisk.textContent = "LOW";
        slopeStatus.textContent = "Lower landslide possibility";
        overallTitle.textContent = "🟢 LOW RISK";
        overallText.textContent = "Current rainfall conditions indicate lower landslide risk.";
    }
}

function updateRisk(rainfall) {
    const risk = document.querySelector(".overall-risk h2");
    const message = document.querySelector(".overall-risk span");

    if (!risk || !message) return;

    if (rainfall >= 100) {
        risk.textContent = "🔴 HIGH RISK";
        message.textContent = "Very heavy rainfall. Stay alert and avoid unstable slopes.";
    } else if (rainfall >= 50) {
        risk.textContent = "🟡 MODERATE RISK";
        message.textContent = "Heavy rainfall detected. Monitor local alerts.";
    } else {
        risk.textContent = "🟢 LOW RISK";
        message.textContent = "Current rainfall conditions indicate lower risk.";
    }
}

function updateRegionalWarning(locationKey, score) {
    const warning = document.getElementById("regionalWarning");
    const location = locations[locationKey];

    if (!warning || !location) {
        return;
    }

    if (score >= 70) {
        warning.innerHTML = `
            🔴 <strong>URGENT: ${location.name}</strong>
            <p>
                Landslide risk is currently elevated.
                Avoid vulnerable mountain roads and unstable slopes.
                Follow instructions from local authorities.
            </p>
        `;
    } else if (score >= 40) {
        warning.innerHTML = `
            🟡 <strong>ALERT: ${location.name}</strong>
            <p>
                Weather conditions require increased awareness.
                Avoid unnecessary travel near vulnerable slopes
                and continue monitoring updates.
            </p>
        `;
    } else {
        warning.innerHTML = `
            🟢 <strong>${location.name}</strong>
            <p>
                No high-risk warning is currently generated
                by Ishana's prototype risk indicator.
            </p>
        `;
    }
}

function updateAlertBanner(score) {
    const alertBanner = document.getElementById("alertBanner");
    const alertText = document.getElementById("alertText");

    if (!alertBanner || !alertText) {
        return;
    }

    if (score >= 70) {
        alertBanner.style.display = "block";
        alertText.textContent =
            "Heavy rainfall may increase landslide risk. Stay alert and follow local authority instructions.";
    } else {
        alertBanner.style.display = "none";
    }
}

function updateSafetyAdvice(rainfall) {
    const safetyMessage = document.getElementById("safetyMessage");

    if (!safetyMessage) {
        return;
    }

    if (rainfall >= 100) {
        safetyMessage.innerHTML = `
            <h3>🔴 HIGH RISK — TAKE PRECAUTIONS</h3>
            <p>
                Heavy rainfall may increase the possibility of
                landslides in vulnerable areas.
            </p>
            <ul>
                <li>🚫 Avoid travelling near steep slopes.</li>
                <li>🏠 Stay away from unstable hillsides.</li>
                <li>📱 Keep your phone fully charged.</li>
                <li>🎒 Keep essential medicines and emergency supplies ready.</li>
                <li>📢 Follow instructions from local authorities.</li>
            </ul>
        `;
    } else if (rainfall >= 50) {
        safetyMessage.innerHTML = `
            <h3>🟡 BE ALERT</h3>
            <p>
                Rainfall is significant. Conditions may become
                dangerous if rainfall continues.
            </p>
            <ul>
                <li>⚠️ Avoid unnecessary travel.</li>
                <li>🏔️ Stay away from steep slopes.</li>
                <li>📱 Monitor weather updates.</li>
                <li>🎒 Keep emergency supplies ready.</li>
            </ul>
        `;
    } else {
        safetyMessage.innerHTML = `
            <h3>🟢 LOW RISK</h3>
            <p>
                Current rainfall is relatively low.
                Continue monitoring the weather.
            </p>
            <ul>
                <li>📱 Keep your phone charged.</li>
                <li>🌦️ Monitor weather updates.</li>
                <li>📢 Follow local authority instructions.</li>
            </ul>
        `;
    }
}

function showSafetyInfo() {
    const safetyInfo = document.getElementById("safetyInfo");

    if (!safetyInfo) {
        return;
    }

    safetyInfo.innerHTML = `
        <h3>🛡️ If a landslide warning is issued:</h3>
        <ul>
            <li>Move to a safer location away from steep slopes.</li>
            <li>Stay away from rivers and drainage channels.</li>
            <li>Do not travel through roads covered by debris.</li>
            <li>Keep essential medicines, water and food ready.</li>
            <li>Keep your phone charged.</li>
            <li>Follow evacuation instructions from local authorities.</li>
        </ul>

        <p>
            <strong>Emergency:</strong> Call 112 if you are in immediate danger.
        </p>
    `;
}

function submitHazardReport() {
    const hazard = document.getElementById("hazard-type").value;
    const description = document.getElementById("hazard-description").value;
    const message = document.getElementById("report-message");

    if (hazard === "") {
        message.textContent = "⚠️ Please select a hazard type.";
        return;
    }

    if (reportLatitude === null || reportLongitude === null) {
        message.textContent = "📍 Please capture your location first.";
        return;
    }

    const report = {
        hazard: hazard,
        description: description || "No description provided.",
        latitude: reportLatitude,
        longitude: reportLongitude,
        time: new Date().toLocaleString()
    };

    savedReports.unshift(report);

    localStorage.setItem(
        "ishanaReports",
        JSON.stringify(savedReports)
    );

    displayReports();

    message.textContent = "✅ Hazard report saved successfully.";

    document.getElementById("hazard-type").value = "";
    document.getElementById("hazard-description").value = "";

    reportLatitude = null;
    reportLongitude = null;

    document.getElementById("report-location-result").textContent = "";
}

let reportLatitude = null;
let reportLongitude = null;
let savedReports = JSON.parse(localStorage.getItem("ishanaReports")) || [];

function displayReports() {
    const reportsContainer = document.getElementById("reports-container");

    if (!reportsContainer) {
        return;
    }

    reportsContainer.textContent = "";

    savedReports.forEach((report) => {
        const reportItem = document.createElement("article");
        reportItem.className = "report-card";

        const title = document.createElement("h3");
        title.textContent = `🚨 ${report.hazard}`;

        const details = document.createElement("p");
        details.textContent = report.description || "No description provided.";

        const coordinates = document.createElement("small");
        coordinates.textContent =
            `📍 ${Number(report.latitude).toFixed(4)}, ${Number(report.longitude).toFixed(4)}`;

        const time = document.createElement("small");
        time.textContent = `🕒 ${report.time || "Time unavailable"}`;

        reportItem.append(title, details, coordinates, time);
        reportsContainer.appendChild(reportItem);
    });
}

displayReports();

function getReportLocation() {
    const locationResult = document.getElementById("report-location-result");

    if (!navigator.geolocation) {
        locationResult.textContent = "❌ Location is not supported by this browser.";
        return;
    }

    locationResult.textContent = "📍 Getting your location...";

    navigator.geolocation.getCurrentPosition(
        function(position) {
            reportLatitude = position.coords.latitude;
            reportLongitude = position.coords.longitude;

            locationResult.textContent =
                `✅ Location captured: ${reportLatitude.toFixed(4)}, ${reportLongitude.toFixed(4)}`;
        },
        function() {
            locationResult.textContent =
                "❌ Unable to get your location. Please allow location access.";
        }
    );
}

function getLocation() {
    const result = document.getElementById("location-result");

    if (!navigator.geolocation) {
        result.textContent = "Location services are not supported by your browser.";
        return;
    }

    result.textContent = "Getting your location...";

    navigator.geolocation.getCurrentPosition(
        function(position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            result.textContent =
                `Location detected: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
        },
        function() {
            result.textContent =
                "Unable to access your location. Please enable location permission.";
        }
    );
}

let rainfall = 12;
let soilMoisture = 0;
let temperature = 18;
const checkRiskButton = document.getElementById("check-risk-button");
const locationSelect = document.getElementById("locationSelect");
const selectedLocation = document.getElementById("selectedLocation");
const regionalWarning = document.getElementById("regionalWarning");
const rainfallDisplay = document.getElementById("rainfall");
const temperatureDisplay = document.getElementById("temperature");
const soilMoistureDisplay = document.getElementById("soilMoisture");
let locationRequestId = 0;
let riskMap;

const riskMapElement = document.getElementById("riskMap");

if (riskMapElement && window.L) {
    riskMap = L.map("riskMap").setView([30.5, 80.5], 5);

    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            attribution: "&copy; OpenStreetMap contributors"
        }
    ).addTo(riskMap);
}

async function addRiskMarkers() {
    if (!riskMap) {
        return;
    }

    for (const key of Object.keys(locations)) {
        const location = locations[key];
        const url =
            `https://api.open-meteo.com/v1/forecast` +
            `?latitude=${location.latitude}` +
            `&longitude=${location.longitude}` +
            `&current=precipitation,soil_moisture_0_to_1cm,temperature_2m` +
            `&timezone=auto`;

        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error("Map weather request failed");
            }

            const data = await response.json();
            const rainfall = data.current.precipitation || 0;
            const soilMoisture =
                data.current.soil_moisture_0_to_1cm || 0;
            const temperature = data.current.temperature_2m || 0;
            let score = 0;

            if (rainfall >= 100) {
                score += 50;
            } else if (rainfall >= 50) {
                score += 30;
            } else if (rainfall >= 20) {
                score += 15;
            }

            if (soilMoisture >= 0.7) {
                score += 30;
            } else if (soilMoisture >= 0.4) {
                score += 15;
            }

            if (temperature >= 25) {
                score += 20;
            } else if (temperature >= 15) {
                score += 10;
            }

            score = Math.min(score, 100);

            const markerColor = score >= 70
                ? "red"
                : score >= 40
                    ? "yellow"
                    : "green";
            const riskText = score >= 70
                ? "🔴 HIGH RISK"
                : score >= 40
                    ? "🟡 MEDIUM RISK"
                    : "🟢 LOW RISK";

            L.circleMarker(
                [location.latitude, location.longitude],
                {
                    radius: 12,
                    color: markerColor,
                    fillColor: markerColor,
                    fillOpacity: 0.7,
                    weight: 3
                }
            )
                .addTo(riskMap)
                .bindPopup(`
                    <b>${location.name}</b><br><br>
                    ${riskText}<br>
                    🌋 Risk Score: ${score}/100<br>
                    🌧️ Rainfall: ${rainfall} mm<br>
                    💧 Soil Moisture: ${soilMoisture}
                `);
        } catch (error) {
            console.error("Map weather error for " + location.name, error);
        }
    }
}

addRiskMarkers();

async function getWeather(locationKey, requestId) {
    const location = locations[locationKey];

    if (!location || !rainfallDisplay || !temperatureDisplay || !soilMoistureDisplay) {
        return;
    }

    try {
        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=precipitation,temperature_2m,soil_moisture_0_to_1cm&timezone=auto`
        );

        if (!response.ok) {
            throw new Error("Current weather request failed");
        }

        const data = await response.json();

        if (requestId !== locationRequestId) {
            return;
        }

        rainfall = data.current.precipitation;
        temperature = data.current.temperature_2m;
        soilMoisture = data.current.soil_moisture_0_to_1cm ?? 0;

        rainfallDisplay.textContent = rainfall;
        temperatureDisplay.textContent = temperature;
        soilMoistureDisplay.textContent = soilMoisture;

        updateCurrentRisk(rainfall, soilMoisture, temperature);
    } catch (error) {
        console.error(error);

        if (requestId !== locationRequestId) {
            return;
        }

        rainfallDisplay.textContent = "Unavailable";
        temperatureDisplay.textContent = "Unavailable";
        soilMoistureDisplay.textContent = "Unavailable";
    }
}

async function getForecast(locationKey, requestId) {
    const location = locations[locationKey];
    const forecastContainer = document.getElementById("forecastData");

    if (!location || !forecastContainer) {
        return;
    }

    const url =
        `https://api.open-meteo.com/v1/forecast` +
        `?latitude=${location.latitude}` +
        `&longitude=${location.longitude}` +
        `&hourly=precipitation` +
        `&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code` +
        `&timezone=auto` +
        `&forecast_days=7`;

    forecastContainer.textContent = "Loading forecast...";

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Forecast request failed");
        }

        const data = await response.json();

        if (requestId !== locationRequestId) {
            return;
        }

        let next24HoursRainfall = 0;

        for (let i = 0; i < 24; i++) {
            next24HoursRainfall += data.hourly.precipitation[i] || 0;
        }

        console.log(
            "Next 24 hours rainfall:",
            next24HoursRainfall.toFixed(1),
            "mm"
        );

        forecastContainer.innerHTML = `<div class="forecast-grid"></div>`;

        const grid = forecastContainer.querySelector(".forecast-grid");

        for (let i = 0; i < data.daily.time.length; i++) {
            const date = data.daily.time[i];
            const dailyRainfall = data.daily.precipitation_sum[i];
            const maxTemp = data.daily.temperature_2m_max[i];
            const minTemp = data.daily.temperature_2m_min[i];
            const day = new Date(date).toLocaleDateString("en-IN", {
                weekday: "short"
            });

            const card = document.createElement("div");
            card.className = "forecast-day";
            card.innerHTML = `
                <h3>${day}</h3>
                <p>🌧️ ${dailyRainfall} mm</p>
                <p>🌡️ ${minTemp}°C - ${maxTemp}°C</p>
            `;

            grid.appendChild(card);
        }

        updateForecastWarning(locationKey, next24HoursRainfall);
    } catch (error) {
        console.error("Forecast error:", error);

        if (requestId !== locationRequestId) {
            return;
        }

        forecastContainer.textContent = "Unable to load forecast.";
    }
}

function updateForecastWarning(locationKey, next24HoursRainfall) {
    const warning = document.getElementById("regionalWarning");
    const location = locations[locationKey];

    if (!warning || !location) {
        return;
    }

    if (next24HoursRainfall >= 100) {
        warning.innerHTML = `
            🔴 <strong>URGENT: ${location.name}</strong>
            <p>Heavy rainfall is expected in the next 24 hours. Avoid vulnerable slopes and mountain roads.</p>
        `;
    } else if (next24HoursRainfall >= 50) {
        warning.innerHTML = `
            🟡 <strong>ALERT: ${location.name}</strong>
            <p>Significant rainfall is expected. Stay alert and monitor local updates.</p>
        `;
    } else {
        warning.innerHTML = `
            🟢 <strong>${location.name}</strong>
            <p>No high-rainfall warning is expected in the next 24 hours.</p>
        `;
    }
}

function calculateHistoricalAverage(yearlyRainfall) {
    const values = Object.values(yearlyRainfall);

    if (values.length === 0) {
        return 0;
    }

    const total = values.reduce(
        (sum, value) => sum + value,
        0
    );

    return total / values.length;
}

function getCurrentMonthAverage(monthlyRainfall) {
    const currentMonth = new Date().toISOString().substring(0, 7);
    const matchingMonths = Object.keys(monthlyRainfall).filter(month =>
        month.endsWith(currentMonth.substring(4, 7))
    );

    if (matchingMonths.length === 0) {
        return 0;
    }

    const total = matchingMonths.reduce(
        (sum, month) => sum + monthlyRainfall[month],
        0
    );

    return total / matchingMonths.length;
}

function calculateSamePeriodAverage(monthlyRainfall, daysPassed) {
    const currentMonth = String(new Date().getMonth() + 1).padStart(2, "0");
    const matchingMonths = Object.keys(monthlyRainfall).filter(month =>
        month.endsWith("-" + currentMonth)
    );

    if (matchingMonths.length === 0) {
        return 0;
    }

    const averages = matchingMonths.map(month => {
        const fullMonthRainfall = monthlyRainfall[month];
        const daysInMonth = new Date(
            Number(month.substring(0, 4)),
            Number(currentMonth),
            0
        ).getDate();

        return fullMonthRainfall * (daysPassed / daysInMonth);
    });

    const total = averages.reduce(
        (sum, value) => sum + value,
        0
    );

    return total / averages.length;
}

function showRainfallComparison(currentRainfall, historicalAverage) {
    const comparison = document.getElementById("rainfallComparison");

    if (!comparison || historicalAverage <= 0) {
        return;
    }

    const difference =
        ((currentRainfall - historicalAverage) / historicalAverage) * 100;

    if (difference >= 30) {
        comparison.innerHTML = `
            🔴 Rainfall is
            <strong>${difference.toFixed(0)}% above normal</strong>
            <br>
            <small>Compared with the historical average.</small>
        `;
    } else if (difference >= 10) {
        comparison.innerHTML = `
            🟡 Rainfall is
            <strong>${difference.toFixed(0)}% above normal</strong>
            <br>
            <small>Continue monitoring conditions.</small>
        `;
    } else if (difference <= -10) {
        comparison.innerHTML = `
            🟢 Rainfall is
            <strong>${Math.abs(difference).toFixed(0)}% below normal</strong>
            <br>
            <small>Compared with the historical average.</small>
        `;
    } else {
        comparison.innerHTML = `
            🟢 Rainfall is
            <strong>near normal</strong>
            <br>
            <small>Compared with the historical average.</small>
        `;
    }
}

function showMonthlyComparison(currentRainfall, historicalAverage) {
    const comparison = document.getElementById("rainfallComparison");

    if (!comparison || historicalAverage <= 0) {
        return;
    }

    const difference =
        ((currentRainfall - historicalAverage) / historicalAverage) * 100;

    if (difference >= 30) {
        comparison.innerHTML = `
            🔴 <strong>${difference.toFixed(0)}% ABOVE NORMAL</strong>
            <br>
            <small>Rainfall is significantly higher than the historical pattern.</small>
        `;
    } else if (difference >= 10) {
        comparison.innerHTML = `
            🟡 <strong>${difference.toFixed(0)}% ABOVE NORMAL</strong>
            <br>
            <small>Rainfall is higher than the historical pattern.</small>
        `;
    } else if (difference <= -10) {
        comparison.innerHTML = `
            🟢 <strong>${Math.abs(difference).toFixed(0)}% BELOW NORMAL</strong>
            <br>
            <small>Rainfall is lower than the historical pattern.</small>
        `;
    } else {
        comparison.innerHTML = `
            🟢 <strong>NEAR NORMAL</strong>
            <br>
            <small>Rainfall is close to the historical pattern.</small>
        `;
    }
}

async function getHistoricalData(locationKey, requestId) {
    const location = locations[locationKey];
    const table = document.getElementById("historicalData");

    if (!location || !table) {
        return;
    }

    const endYear = new Date().getFullYear() - 1;
    const startYear = endYear - 14;
    const startDate = `${startYear}-01-01`;
    const endDate = `${endYear}-12-31`;

    const url =
        `https://archive-api.open-meteo.com/v1/archive` +
        `?latitude=${location.latitude}` +
        `&longitude=${location.longitude}` +
        `&start_date=${startDate}` +
        `&end_date=${endDate}` +
        `&daily=precipitation_sum` +
        `&timezone=auto`;

    table.innerHTML = `<tr><td colspan="2">Loading historical data...</td></tr>`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Historical data request failed");
        }

        const data = await response.json();

        if (requestId !== locationRequestId) {
            return;
        }

        const yearlyRainfall = {};
        const monthlyRainfall = {};

        data.daily.time.forEach((date, index) => {
            const year = date.substring(0, 4);
            const month = date.substring(0, 7);
            const dailyRainfall = data.daily.precipitation_sum[index] || 0;

            yearlyRainfall[year] = (yearlyRainfall[year] || 0) + dailyRainfall;
            monthlyRainfall[month] =
                (monthlyRainfall[month] || 0) + dailyRainfall;
        });

        const monthlyAverage =
            getCurrentMonthAverage(monthlyRainfall);

        console.log(
            "Historical average for current month:",
            monthlyAverage.toFixed(1),
            "mm"
        );

        const daysPassed = new Date().getDate();
        const samePeriodAverage = calculateSamePeriodAverage(
            monthlyRainfall,
            daysPassed
        );

        console.log(
            "Historical rainfall for same period:",
            samePeriodAverage.toFixed(1),
            "mm"
        );

        const historicalAverage =
            calculateHistoricalAverage(yearlyRainfall);

        console.log(
            "15-year average rainfall:",
            historicalAverage.toFixed(1),
            "mm"
        );

        showRainfallComparison(rainfall, historicalAverage);

        table.innerHTML = "";
        const years = [];
        const rainfallValues = [];

        Object.keys(yearlyRainfall).sort().forEach(year => {
            years.push(year);
            rainfallValues.push(Number(yearlyRainfall[year].toFixed(1)));

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${year}</td>
                <td>${yearlyRainfall[year].toFixed(1)}</td>
            `;

            table.appendChild(row);
        });

        const chartCanvas = document.getElementById("rainfallChart");

        if (chartCanvas && window.Chart) {
            if (window.rainfallChartInstance) {
                window.rainfallChartInstance.destroy();
            }

            window.rainfallChartInstance = new Chart(chartCanvas, {
                type: "line",
                data: {
                    labels: years,
                    datasets: [{
                        label: "Annual Rainfall (mm)",
                        data: rainfallValues,
                        tension: 0.4,
                        fill: true,
                        pointRadius: 5,
                        pointHoverRadius: 8
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            display: true
                        },
                        tooltip: {
                            enabled: true
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: "Rainfall (mm)"
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: "Year"
                            }
                        }
                    }
                }
            });
        }
    } catch (error) {
        console.error("Historical data error:", error);

        if (requestId !== locationRequestId) {
            return;
        }

        table.innerHTML = `
            <tr>
                <td colspan="2">Unable to load historical data.</td>
            </tr>
        `;
    }
}

async function getMonthlyRainfall(locationKey) {
    const location = locations[locationKey];

    if (!location) {
        return;
    }

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const startDate = `${year}-${month}-01`;
    const endDate = `${year}-${month}-${day}`;

    const url =
        `https://archive-api.open-meteo.com/v1/archive` +
        `?latitude=${location.latitude}` +
        `&longitude=${location.longitude}` +
        `&start_date=${startDate}` +
        `&end_date=${endDate}` +
        `&daily=precipitation_sum` +
        `&timezone=auto`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Monthly rainfall request failed");
        }

        const data = await response.json();
        const totalRainfall = data.daily.precipitation_sum.reduce(
            (total, rain) => total + (rain || 0),
            0
        );

        const rainfallComparison =
            document.getElementById("rainfallComparison");

        if (rainfallComparison) {
            rainfallComparison.textContent =
                `This month's rainfall: ${totalRainfall.toFixed(1)} mm`;
        }

        console.log(
            "Rainfall this month:",
            totalRainfall.toFixed(1),
            "mm"
        );
    } catch (error) {
        console.error("Monthly rainfall error:", error);
    }
}

async function refreshLocation(locationKey) {
    if (!locations[locationKey]) {
        return;
    }

    const requestId = ++locationRequestId;
    await Promise.all([
        getWeather(locationKey, requestId),
        getForecast(locationKey, requestId),
        getHistoricalData(locationKey, requestId)
    ]);

    if (requestId !== locationRequestId) {
        return;
    }
}

updateCurrentRisk(rainfall, soilMoisture, temperature);
refreshLocation(locationSelect?.value || "manali");
getMonthlyRainfall(locationSelect?.value || "manali");

if (checkRiskButton) {
    checkRiskButton.addEventListener("click", () => {
        updateCurrentRisk(rainfall, soilMoisture, temperature);
        document.querySelector(".risk-card")?.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    });
}

if (locationSelect && selectedLocation) {
    locationSelect.addEventListener("change", function () {
        const selectedLocationData = locations[locationSelect.value];
        const selectedText = selectedLocationData
            ? selectedLocationData.name
            : locationSelect.options[locationSelect.selectedIndex].text;

        selectedLocation.textContent =
            "Selected location: " + selectedText;

        if (regionalWarning) {
            regionalWarning.textContent =
                "🟢 No active warning for " + selectedText + ".";
        }

        console.log("Location changed to:", selectedText);
        const selectedKey = locationSelect.value;

        if (riskMap) {
            const location = locations[selectedKey];
            riskMap.setView([location.latitude, location.longitude], 8);
        }

        getMonthlyRainfall(selectedKey);
        refreshLocation(selectedKey);
    });
}