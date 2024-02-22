function attachEvents() {
  const submitBtn = document.getElementById("submit");
  const inputLocation = document.getElementById("location");
  const forecast = document.getElementById("forecast");
  const currentWeather = document.getElementById("current");
  const upcomingWeather = document.getElementById("upcoming");

  const conditions = {
    Sunny: "&#x2600",
    "Partly sunny": "&#x26C5",
    Overcast: "&#x2601",
    Rain: "&#x2614",
    Degrees: "&#176",
  };

  submitBtn.addEventListener("click", getWeather);

  async function getWeather() {
    const url = "http://localhost:3030/jsonstore/forecaster/locations";

    try {
      const response = await fetch(url);
      if (response.ok == false) {
        throw new Error(`${response.status} (${response.statusText})`);
      }
      const data = await response.json();
      const town = data.find(
        (el) => el.name.toLowerCase() == inputLocation.value.toLowerCase()
      );

      if (!town) {
        throw new Error("Error (Invalid town name)!");
      }
      forecast.style.display = "block";

      if (town) {
        getWeatherToday(town.code);
        getWeatherUpcoming(town.code);
        inputLocation.value = "";
      }
    } catch (error) {
      forecast.style.display = "block";
      forecast.innerHTML = `<p id="errorMessage">${error.message}</p>`;
    }
  }

  async function getWeatherToday(code) {
    if (document.getElementById("errorMessage")) {
      document.getElementById("errorMessage").remove();
    }

    const url = `http://localhost:3030/jsonstore/forecaster/today/${code}`;

    try {
      const response = await fetch(url);
      if (response.ok == false) {
        const error = await response.json();
        throw error;
      }
      const data = await response.json();

      const divCurrent = document.createElement("div");
      divCurrent.setAttribute("class", "forecasts");
      divCurrent.innerHTML = `<span class="condition symbol">${
        conditions[data.forecast.condition]
      }</span>
      <span class="condition">
        <span class="forecast-data">${data.name}</span>
        <span class="forecast-data">${data.forecast.low}°/${
        data.forecast.high
      }°</span>
        <span class="forecast-data">${data.forecast.condition}</span>
      </span> `;

      currentWeather.appendChild(divCurrent);
    } catch (error) {
      currentWeather.textContent = error.message;
    }
  }

  async function getWeatherUpcoming(code) {
    const url = `http://localhost:3030/jsonstore/forecaster/upcoming/${code}`;

    try {
      const response = await fetch(url);
      if (response.ok == false) {
        const error = await response.json();
        throw error;
      }
      const data = await response.json();

      const divForecastInfo = document.createElement("div");
      divForecastInfo.setAttribute("class", "forecast-info");

      for (let el of data.forecast) {
        divForecastInfo.innerHTML = `
        <span class="upcoming">
        <span class="symbol">${conditions[el.condition]}</span>
        <span class="forecast-data">${el.low}°/${el.high}°</span>
        <span class="forecast-data">${el.condition}</span>
        </span>
        `;

        upcomingWeather.appendChild(divForecastInfo);
      }
    } catch (error) {
      upcomingWeather.textContent = error.message;
    }
  }
}

attachEvents();
