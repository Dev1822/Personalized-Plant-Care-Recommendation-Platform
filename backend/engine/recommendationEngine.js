// engine/recommendationEngine.js
// Core logic: compares user's environment with plant's ideal conditions
// Returns personalized recommendations and a health score (0-100)

/**
 * Maps light level strings to numeric values for comparison
 */
const LIGHT_MAP = { Low: 1, Medium: 2, High: 3 };

/**
 * Calculate overall Plant Health Score (0-100)
 * Weighted sum of individual condition scores
 */
function calculateHealthScore(plant, userConditions) {
  const { light, temperature, humidity, watering_habit } = userConditions;

  // --- Watering Score (25 pts) ---
  const waterDiff = Math.abs(watering_habit - plant.ideal_water_frequency);
  const waterPct = waterDiff / plant.ideal_water_frequency;
  const waterScore = Math.max(0, 25 - waterPct * 25);

  // --- Temperature Score (30 pts) ---
  let tempScore = 30;
  if (temperature < plant.ideal_temperature_min) {
    const deficit = plant.ideal_temperature_min - temperature;
    tempScore = Math.max(0, 30 - deficit * 2);
  } else if (temperature > plant.ideal_temperature_max) {
    const excess = temperature - plant.ideal_temperature_max;
    tempScore = Math.max(0, 30 - excess * 2);
  }

  // --- Humidity Score (25 pts) ---
  const humidityDiff = Math.abs(humidity - plant.ideal_humidity);
  const humidityPct = humidityDiff / plant.ideal_humidity;
  const humidityScore = Math.max(0, 25 - humidityPct * 25);

  // --- Light Score (20 pts) ---
  const userLightNum = LIGHT_MAP[light] || 2;
  const idealLightNum = LIGHT_MAP[plant.ideal_light] || 2;
  const lightDiff = Math.abs(userLightNum - idealLightNum);
  const lightScore = lightDiff === 0 ? 20 : lightDiff === 1 ? 10 : 0;

  const total = Math.round(waterScore + tempScore + humidityScore + lightScore);
  return Math.min(100, Math.max(0, total));
}

/**
 * Generate detailed text recommendations for each condition
 */
function generateRecommendations(plant, userConditions) {
  const { light, temperature, humidity, watering_habit } = userConditions;
  const recommendations = [];

  // --- Watering Recommendation ---
  const waterDiff = watering_habit - plant.ideal_water_frequency;
  if (Math.abs(waterDiff) <= 1) {
    recommendations.push({
      category: 'Watering',
      status: 'good',
      icon: '💧',
      message: `Your watering schedule is on point! Water every ${plant.ideal_water_frequency} days.`,
      detail: `Current: every ${watering_habit} days | Ideal: every ${plant.ideal_water_frequency} days`
    });
  } else if (waterDiff < 0) {
    // User waters less frequently (more days = less often)
    recommendations.push({
      category: 'Watering',
      status: 'warning',
      icon: '💧',
      message: `You may be underwatering. Increase frequency to every ${plant.ideal_water_frequency} days.`,
      detail: `Current: every ${watering_habit} days | Ideal: every ${plant.ideal_water_frequency} days. Signs of underwatering: wilting, dry soil, yellowing leaves.`
    });
  } else {
    // User waters more frequently (fewer days = more often)
    recommendations.push({
      category: 'Watering',
      status: 'warning',
      icon: '💧',
      message: `Reduce watering to every ${plant.ideal_water_frequency} days to prevent root rot.`,
      detail: `Current: every ${watering_habit} days | Ideal: every ${plant.ideal_water_frequency} days. Overwatering is the #1 cause of houseplant death.`
    });
  }

  // --- Temperature Recommendation ---
  if (temperature >= plant.ideal_temperature_min && temperature <= plant.ideal_temperature_max) {
    recommendations.push({
      category: 'Temperature',
      status: 'good',
      icon: '🌡️',
      message: `Temperature is within the ideal range (${plant.ideal_temperature_min}–${plant.ideal_temperature_max}°C).`,
      detail: `Current: ${temperature}°C | Ideal: ${plant.ideal_temperature_min}–${plant.ideal_temperature_max}°C`
    });
  } else if (temperature < plant.ideal_temperature_min) {
    const deficit = Math.round(plant.ideal_temperature_min - temperature);
    recommendations.push({
      category: 'Temperature',
      status: 'danger',
      icon: '🌡️',
      message: `Temperature is too cold by ${deficit}°C. Move to a warmer location.`,
      detail: `Current: ${temperature}°C | Ideal min: ${plant.ideal_temperature_min}°C. Avoid cold drafts and windowsills in winter.`
    });
  } else {
    const excess = Math.round(temperature - plant.ideal_temperature_max);
    recommendations.push({
      category: 'Temperature',
      status: 'danger',
      icon: '🌡️',
      message: `Temperature is too hot by ${excess}°C. Move away from heat sources.`,
      detail: `Current: ${temperature}°C | Ideal max: ${plant.ideal_temperature_max}°C. Ensure good airflow and avoid direct afternoon sun.`
    });
  }

  // --- Humidity Recommendation ---
  const humidDiff = humidity - plant.ideal_humidity;
  if (Math.abs(humidDiff) <= 10) {
    recommendations.push({
      category: 'Humidity',
      status: 'good',
      icon: '💨',
      message: `Humidity level is great for this plant!`,
      detail: `Current: ${humidity}% | Ideal: ${plant.ideal_humidity}%`
    });
  } else if (humidDiff < 0) {
    recommendations.push({
      category: 'Humidity',
      status: 'warning',
      icon: '💨',
      message: `Humidity is too low. Aim for ${plant.ideal_humidity}% using a humidifier or pebble tray.`,
      detail: `Current: ${humidity}% | Ideal: ${plant.ideal_humidity}%. Misting leaves regularly can also help.`
    });
  } else {
    recommendations.push({
      category: 'Humidity',
      status: 'warning',
      icon: '💨',
      message: `Humidity is slightly high. Improve air circulation to prevent fungal issues.`,
      detail: `Current: ${humidity}% | Ideal: ${plant.ideal_humidity}%. Ensure good airflow around the plant.`
    });
  }

  // --- Light Recommendation ---
  const userLightNum = LIGHT_MAP[light] || 2;
  const idealLightNum = LIGHT_MAP[plant.ideal_light] || 2;
  const lightDiff = userLightNum - idealLightNum;

  if (lightDiff === 0) {
    recommendations.push({
      category: 'Light',
      status: 'good',
      icon: '☀️',
      message: `Light conditions are perfect for ${plant.common_name || plant.name}.`,
      detail: `Current: ${light} | Ideal: ${plant.ideal_light} light`
    });
  } else if (lightDiff < 0) {
    recommendations.push({
      category: 'Light',
      status: 'warning',
      icon: '☀️',
      message: `More light needed. Move to a brighter spot or add a grow light.`,
      detail: `Current: ${light} | Ideal: ${plant.ideal_light} light. Low light causes leggy growth and pale leaves.`
    });
  } else {
    recommendations.push({
      category: 'Light',
      status: 'warning',
      icon: '☀️',
      message: `Too much direct light. Move to a spot with ${plant.ideal_light.toLowerCase()} indirect light.`,
      detail: `Current: ${light} | Ideal: ${plant.ideal_light} light. Excess sun causes scorched, bleached leaves.`
    });
  }

  // --- Fertilizer Recommendation (always informational) ---
  recommendations.push({
    category: 'Fertilizer',
    status: 'info',
    icon: '🌿',
    message: `Recommended fertilizer schedule: ${plant.fertilizer_schedule}`,
    detail: `Use a balanced liquid fertilizer. Reduce or stop feeding in autumn and winter when growth slows.`
  });

  return recommendations;
}

/**
 * Main analysis function
 * @param {Object} plant - Plant record from DB
 * @param {Object} userConditions - { light, temperature, humidity, watering_habit }
 * @returns {Object} Full analysis result
 */
function analyzeConditions(plant, userConditions) {
  const healthScore = calculateHealthScore(plant, userConditions);
  const recommendations = generateRecommendations(plant, userConditions);

  const healthLabel =
    healthScore >= 85 ? 'Thriving 🌟' :
    healthScore >= 70 ? 'Healthy 🌱' :
    healthScore >= 50 ? 'Needs Attention ⚠️' :
    'Struggling 🆘';

  return {
    plant: {
      id: plant.id,
      name: plant.name,
      common_name: plant.common_name,
      category: plant.category,
      care_difficulty: plant.care_difficulty,
      description: plant.description
    },
    userConditions,
    idealConditions: {
      light: plant.ideal_light,
      temperature_min: plant.ideal_temperature_min,
      temperature_max: plant.ideal_temperature_max,
      humidity: plant.ideal_humidity,
      watering_frequency: plant.ideal_water_frequency,
      fertilizer_schedule: plant.fertilizer_schedule
    },
    healthScore,
    healthLabel,
    recommendations
  };
}

module.exports = { analyzeConditions, calculateHealthScore };
