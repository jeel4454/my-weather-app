import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [city, setCity] = useState('London');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const apiKey = 'c11aa95762ad3c3b51b5ca85b4e1647c';

  const getWeather = async (cityName) => {
    const trimmedCity = cityName.trim();

    if (!trimmedCity) {
      setError('⚠️ Please enter a city name');
      setWeather(null);
      return;
    }

    setLoading(true);
    setError('');
    setWeather(null);

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${trimmedCity}&appid=${apiKey}&units=metric`
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('🚫 City not found');
        } else {
          throw new Error('⚠️ Failed to fetch weather data');
        }
      }

      const data = await response.json();
      setWeather(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load default weather (London) on first render
  useEffect(() => {
    getWeather(city);
  }, []);

  return (
    <div className="app-container">
      <h1>🌦️ Weather App</h1>

      <div className="input-group">
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && getWeather(city)}
        />
        <button onClick={() => getWeather(city)}>Get Weather</button>
      </div>

      {loading && <p className="loading">⏳ Loading...</p>}
      {error && <p className="error">{error}</p>}

      {weather && (
        <div className="weather-card">
          <h2>
            {weather.name}, {weather.sys.country}
          </h2>
          <img src="/weather.jpg" alt="Weather icon" />
          <p>🌡️ Temperature: {Math.round(weather.main.temp)}°C</p>
          <p>☁️ Condition: {weather.weather[0].description}</p>
          <p>💧 Humidity: {weather.main.humidity}%</p>
          <p>💨 Wind Speed: {(weather.wind.speed * 3.6).toFixed(1)} km/h</p>
        </div>
      )}
    </div>
  );
}

export default App;
