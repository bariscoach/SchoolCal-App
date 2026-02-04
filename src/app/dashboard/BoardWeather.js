'use client';

import { useState, useEffect } from 'react';

export default function BoardWeather({ latitude, longitude }) {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);

    // 1. Determine Target Date (Next School Day)
    const getNextSchoolDay = () => {
        const d = new Date();
        const day = d.getDay(); // 0=Sun, 6=Sat

        let addDays = 1; // Default: Tomorrow
        if (day === 5) addDays = 3; // Friday -> Monday
        if (day === 6) addDays = 2; // Saturday -> Monday
        // Sunday (0) -> Tomorrow (Monday) is already covered by default 1? 
        // Sunday is 0. If today is Sunday, usually we want Monday. 
        // Wait, if today is Sunday (0), 'Tomorrow' is Monday (1). Correct.
        // If today is Friday (5), 'Tomorrow' is Sat. We want Mon (3 days later).
        // If today is Saturday (6), 'Tomorrow' is Sun. We want Mon (2 days later).

        d.setDate(d.getDate() + addDays);
        return d.toISOString().split('T')[0]; // YYYY-MM-DD
    };

    const targetDate = getNextSchoolDay();
    // Helper for display text
    const getTargetDayName = () => {
        const d = new Date(targetDate + 'T12:00:00');
        return d.toLocaleDateString('en-US', { weekday: 'long' });
    };

    useEffect(() => {
        if (!latitude || !longitude) {
            setLoading(false);
            return;
        }

        async function fetchWeather() {
            try {
                // Fetch specific date range
                const res = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,snowfall_sum,precipitation_probability_max&timezone=America%2FToronto&start_date=${targetDate}&end_date=${targetDate}`
                );
                const data = await res.json();
                setWeather(data);
            } catch (e) {
                console.error("BoardWeather fetch error:", e);
            } finally {
                setLoading(false);
            }
        }

        fetchWeather();
    }, [latitude, longitude, targetDate]);

    if (loading) return <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>Loading...</span>;
    if (!weather?.daily) return null;

    const temp = Math.round(weather.daily.temperature_2m_max[0]);
    const snow = weather.daily.snowfall_sum[0];
    const precipProb = weather.daily.precipitation_probability_max[0];

    // Formula: (SnowCm / 20) * PrecipProb. Cap at 95% (never 100% sure).
    let prob = (snow / 20) * (precipProb / 100);
    if (prob > 0.95) prob = 0.95;
    const probabilityPercent = Math.round(prob * 100);

    // Color code
    let color = '#22c55e'; // Green
    if (probabilityPercent > 30) color = '#eab308'; // Yellow
    if (probabilityPercent > 60) color = '#ef4444'; // Red

    return (
        <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.8rem', alignItems: 'center', fontSize: '0.85rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '8px' }}>
                🌡️ {temp}°C
            </div>

            {probabilityPercent > 0 ? (
                <div style={{ color: color, fontWeight: 'bold' }}>
                    ❄️ {probabilityPercent}% Chance ({getTargetDayName()})
                </div>
            ) : (
                <div style={{ opacity: 0.6 }}>
                    ❄️ 0% Chance ({getTargetDayName()})
                </div>
            )}
        </div>
    );
}
