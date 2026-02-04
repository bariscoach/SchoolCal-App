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
    const precipProb = weather.daily.precipitation_probability_max[0] / 100; // Normalize 0-1

    // Heuristics based on "Historical Data" patterns in Ontario

    // 1. Bus Cancellation (Sensitive)
    // - Cancellations happen easily with freezing rain or ~15cm snow
    let busChance = 0;
    if (snow > 10) busChance += 0.4;
    if (snow > 15) busChance += 0.4;
    if (snow > 20) busChance += 0.2;
    // Freezing rain proxy (if temp < 0 and high precip prob but low snow, likely ice)
    if (temp < 0 && precipProb > 0.8 && snow < 5) busChance += 0.6;

    busChance = busChance * precipProb; // Scale by probability of precip happening
    if (busChance > 0.95) busChance = 0.95;

    // 2. School Closure (Strict)
    // - Rarely close. Needs >25-30cm snow or extreme cold/ice.
    let schoolChance = 0;
    if (snow > 20) schoolChance += 0.3;
    if (snow > 30) schoolChance += 0.5;
    if (temp < -30) schoolChance += 0.4; // Extreme cold
    // Ice storm proxy
    if (temp < 0 && precipProb > 0.9 && snow < 2) schoolChance += 0.5;

    schoolChance = schoolChance * precipProb;
    if (schoolChance > 0.95) schoolChance = 0.95;

    const busPercent = Math.round(busChance * 100);
    const schoolPercent = Math.round(schoolChance * 100);

    // Color helpers
    const getColor = (p) => {
        if (p > 60) return '#ef4444'; // Red
        if (p > 30) return '#eab308'; // Yellow
        return 'rgba(255,255,255,0.6)'; // Neutral/Greenish
    };

    return (
        <div style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
            {/* Temperature & Day */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '8px' }}>
                <span style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '8px', fontWeight: 'bold' }}>
                    🌡️ {temp}°C
                </span>
                <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>{getTargetDayName()}</span>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '8px', padding: '8px 10px' }}>
                {/* Bus Prediction */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', marginBottom: '4px' }}>
                    <span style={{ opacity: 0.9 }}>🚌 Bus Cancellation</span>
                    <span style={{ fontWeight: 'bold', color: getColor(busPercent) }}>{busPercent}%</span>
                </div>

                {/* School Closure Prediction */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
                    <span style={{ opacity: 0.9 }}>🏫 School Closure</span>
                    <span style={{ fontWeight: 'bold', color: getColor(schoolPercent) }}>{schoolPercent}%</span>
                </div>
            </div>
        </div>
    );
}
