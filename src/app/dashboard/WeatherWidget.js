'use client';

import { useState, useEffect } from 'react';
import styles from './Dashboard.module.css'; // Reuse existing styles or make new module

export default function WeatherWidget({ board }) {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!board?.latitude || !board?.longitude) {
            setLoading(false);
            return;
        }

        async function fetchWeather() {
            try {
                // Fetch 7-day forecast: Max Temp, Snow Sum, Precip Prob Max
                const res = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${board.latitude}&longitude=${board.longitude}&daily=temperature_2m_max,snowfall_sum,precipitation_probability_max,weather_code&timezone=America%2FToronto`
                );
                const data = await res.json();
                setWeather(data);
            } catch (e) {
                console.error("Weather fetch error:", e);
            } finally {
                setLoading(false);
            }
        }

        fetchWeather();
    }, [board]);

    if (!board) return null;
    if (loading) return <div className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>Loading weather for {board.name}...</div>;
    if (!weather?.daily) return null; // No data or error

    // Helper to decode WMO weather codes (simplified)
    const getWeatherIcon = (code) => {
        if (code === 0) return '☀️'; // Clear
        if (code <= 3) return '⛅'; // Cloudy
        if (code <= 48) return '🌫️'; // Fog
        if (code <= 57) return '🌧️'; // Drizzle
        if (code <= 67) return '☔'; // Rain
        if (code <= 77) return '❄️'; // Snow grains
        if (code <= 82) return '🌧️'; // Rain showers
        if (code <= 86) return '🌨️'; // Snow showers
        if (code <= 99) return '⛈️'; // Thunderstorm
        return '🌤️';
    };

    // Calculate Snow Day Probability
    const getSnowDayChance = (snowSum, precipProb, tempMax) => {
        if (snowSum > 15) return { chance: 'HIGH', color: '#ef4444', text: '❄️ High Chance (Heavy Snow)' };
        if (snowSum > 10) return { chance: 'MEDIUM', color: '#eab308', text: '🌨️ Possible (Significant Snow)' };
        if (precipProb > 80 && tempMax < 0) return { chance: 'MEDIUM', color: '#eab308', text: '🧊 Possible (Icy Condition)' };
        return { chance: 'LOW', color: '#22c55e', text: 'School likely open' };
    };

    // Get today and next 2 days
    const daily = weather.daily;
    const daysToShow = 5;

    return (
        <div className="glass-panel" style={{ padding: '20px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem' }}>🌨️ Snow Day Forecast</h3>
                <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>{board.region}</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(60px, 1fr))', gap: '10px' }}>
                {daily.time.slice(0, daysToShow).map((dateStr, i) => {
                    const date = new Date(dateStr + 'T12:00:00'); // Force noon to avoid timezone shift issues roughly
                    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                    const tempMax = daily.temperature_2m_max[i];
                    const snowSum = daily.snowfall_sum[i];
                    const precipProb = daily.precipitation_probability_max[i];
                    const code = daily.weather_code[i];

                    const prediction = getSnowDayChance(snowSum, precipProb, tempMax);

                    return (
                        <div key={dateStr} style={{
                            textAlign: 'center',
                            background: prediction.chance === 'HIGH' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255,255,255,0.05)',
                            padding: '10px 5px',
                            borderRadius: '10px',
                            border: prediction.chance === 'HIGH' ? '1px solid #ef4444' : 'none'
                        }}>
                            <div style={{ fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '5px' }}>{dayName}</div>
                            <div style={{ fontSize: '1.5rem', marginBottom: '5px' }}>{getWeatherIcon(code)}</div>
                            <div style={{ fontSize: '0.8rem' }}>{Math.round(tempMax)}°</div>
                            {snowSum > 0 && <div style={{ fontSize: '0.7rem', color: '#93c5fd' }}>{snowSum}cm</div>}
                        </div>
                    );
                })}
            </div>

            {/* Show prediction for tomorrow if relevant */}
            <div style={{ marginTop: '15px', padding: '10px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', fontSize: '0.9rem' }}>
                <strong>Tomorrow's Prediction: </strong>
                {(() => {
                    const i = 1; // Tomorrow
                    const prediction = getSnowDayChance(daily.snowfall_sum[i], daily.precipitation_probability_max[i], daily.temperature_2m_max[i]);
                    return <span style={{ color: prediction.color, fontWeight: 'bold' }}>{prediction.text}</span>
                })()}
            </div>
        </div>
    );
}
