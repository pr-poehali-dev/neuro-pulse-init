-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    role VARCHAR(50) DEFAULT 'user',
    daily_requests_remaining INTEGER DEFAULT 10,
    bonus_requests INTEGER DEFAULT 0,
    subscription_type VARCHAR(50),
    subscription_requests INTEGER DEFAULT 0,
    last_daily_reset TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tariffs table
CREATE TABLE IF NOT EXISTS tariffs (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price_rub DECIMAL(10, 2) NOT NULL,
    requests_count INTEGER,
    is_unlimited BOOLEAN DEFAULT FALSE,
    duration_days INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    tariff_id INTEGER REFERENCES tariffs(id),
    amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50),
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AI Requests table
CREATE TABLE IF NOT EXISTS ai_requests (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    request_text TEXT NOT NULL,
    response_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default tariffs
INSERT INTO tariffs (name, price_rub, requests_count, is_unlimited, duration_days) VALUES
    ('Стартовый', 199.00, 20, FALSE, NULL),
    ('Продвинутый', 299.00, 40, FALSE, NULL),
    ('Безлимит', 749.00, NULL, TRUE, 30);

-- Insert CEO account with strong credentials
INSERT INTO users (username, password_hash, email, role, daily_requests_remaining, bonus_requests, subscription_type) VALUES
    ('ceo_egor_selitsky_2025', '$2b$10$YQiGGnLdP6Y8vHKXzJ.Zd.3xGHvZqK3gP8JmqR5TnVwXyU9pQaLmK', 'ceo@neuropulse.ai', 'admin', 999999, 999999, 'unlimited');