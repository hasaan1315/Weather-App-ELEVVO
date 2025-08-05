const apiKey = "dbffa2d50ea062be45acad84bc8530ef";

let forecastChart = null; // ✅ Store chart instance globally

// Fetch weather data
async function getWeatherData(city) {
  if (!city) {
    alert("Please enter a city name.");
    return;
  }

  try {
    // Show loading state
    document.getElementById("city").textContent = "Loading...";
    document.getElementById("temperature").textContent = "--";
    document.getElementById("weather-desc").textContent = "--";

    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`
    );

    if (!res.ok) {
      const errorData = await res.json();
      const message = errorData.message || "Unable to fetch weather. Please check the city name.";
      throw new Error(message);
    }

    const data = await res.json();

    // ✅ Update UI
    document.getElementById("city").textContent = `${data.name}, ${data.sys.country}`;
    document.getElementById("temperature").textContent = `${data.main.temp.toFixed(1)}°C`;
    document.getElementById("weather-desc").textContent = data.weather[0].description;

    document.getElementById("humidity").textContent = `${data.main.humidity}%`;
    document.getElementById("wind").textContent = `${data.wind.speed} Kmph`;
    document.getElementById("visibility").textContent = `${(data.visibility / 1000).toFixed(1)} KM`;
    document.getElementById("pressure").textContent = `${(data.main.pressure * 0.03).toFixed(2)} in`;
    document.getElementById("uv").textContent = "--";
    document.getElementById("precip").textContent = "0.0 mm";

    const sunrise = new Date(data.sys.sunrise * 1000);
    const sunset = new Date(data.sys.sunset * 1000);
    document.getElementById("sunrise").textContent = sunrise.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    document.getElementById("sunset").textContent = sunset.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    drawForecastChart(); // Dummy data for forecast

  } catch (err) {
    console.error("Weather fetch error:", err);
    alert(err.message || "Something went wrong. Try again.");
  }
}

// ✅ Draw forecast chart with chart instance handling
function drawForecastChart() {
  const ctx = document.getElementById("forecastChart").getContext("2d");

  // ✅ Destroy existing chart before creating a new one
  if (forecastChart) {
    forecastChart.destroy();
  }

  forecastChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"],
      datasets: [{
        label: "°C",
        data: [21.1, 21.7, 23, 23.8, 23.9, 24.1, 24.2],
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        borderColor: "#00bfff",
        borderWidth: 2,
        fill: false,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          ticks: { color: "#fff" },
          grid: { color: "#444" }
        },
        x: {
          ticks: { color: "#fff" },
          grid: { display: false }
        }
      },
      plugins: {
        legend: { display: false }
      }
    }
  });
}

// Handle search button
document.getElementById("search-btn").addEventListener("click", () => {
  const city = document.getElementById("search-input").value.trim();
  getWeatherData(city);
});

// Handle Enter key
document.getElementById("search-input").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    document.getElementById("search-btn").click();
  }
});
