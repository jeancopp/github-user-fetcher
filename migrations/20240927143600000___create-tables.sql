CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    github_id BIGINT UNIQUE NOT NULL,
    login VARCHAR(100) NOT NULL,
    name VARCHAR(100),
    location VARCHAR(100),
    meta_data json,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS technologies (
     id SERIAL PRIMARY KEY,
     name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS user_stack (
    user_id INTEGER REFERENCES users(id)
        ON DELETE CASCADE,
    tech_id INTEGER REFERENCES technologies(id)
        ON DELETE CASCADE,
    PRIMARY KEY (user_id, tech_id)
);
