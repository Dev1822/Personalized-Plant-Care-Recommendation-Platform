-- PlantPal Database Schema
-- Run this file to create the database and tables

CREATE DATABASE IF NOT EXISTS plantpal;
USE plantpal;

-- Plants table: stores ideal care conditions for each plant species
CREATE TABLE IF NOT EXISTS plants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  common_name VARCHAR(100),
  category VARCHAR(50),                    -- e.g., Succulent, Tropical, Herb, Fern
  ideal_light ENUM('Low', 'Medium', 'High') NOT NULL,
  ideal_water_frequency INT NOT NULL,       -- days between watering
  ideal_temperature_min DECIMAL(4,1) NOT NULL,  -- °C
  ideal_temperature_max DECIMAL(4,1) NOT NULL,  -- °C
  ideal_humidity INT NOT NULL,              -- percentage 0-100
  fertilizer_schedule VARCHAR(100) NOT NULL,     -- e.g., "Every 2 weeks in spring/summer"
  care_difficulty ENUM('Easy', 'Moderate', 'Hard') DEFAULT 'Moderate',
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users table: authentication and profile data
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,           -- hashed in production
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- User plants table: user's tracked plants with their environment readings
CREATE TABLE IF NOT EXISTS user_plants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,                              -- nullable for anonymous use
  plant_id INT NOT NULL,
  light ENUM('Low', 'Medium', 'High') NOT NULL,
  temperature DECIMAL(4,1) NOT NULL,        -- °C
  humidity INT NOT NULL,                    -- percentage
  watering_habit INT NOT NULL,              -- days between watering
  health_score INT,                         -- 0-100 calculated score
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (plant_id) REFERENCES plants(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Indexes for performance
CREATE INDEX idx_user_plants_user_id ON user_plants(user_id);
CREATE INDEX idx_user_plants_plant_id ON user_plants(plant_id);
CREATE INDEX idx_plants_category ON plants(category);
CREATE INDEX idx_plants_light ON plants(ideal_light);
