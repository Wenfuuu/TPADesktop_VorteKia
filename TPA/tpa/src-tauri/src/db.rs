use diesel::prelude::*;
use dotenvy::dotenv;
use std::env;
use std::sync::{OnceLock, Mutex};

// Builder Pattern
pub struct AppConfig {
    pub database_url: String,
    pub redis_url: String,
}

pub struct AppConfigBuilder {
    database_url: Option<String>,
    redis_url: Option<String>,
}

impl AppConfigBuilder {
    pub fn new() -> Self {
        dotenv().ok(); // load .env once here
        Self {
            database_url: env::var("DATABASE_URL").ok(),
            redis_url: env::var("REDIS_URL").ok(),
        }
    }

    pub fn build(self) -> AppConfig {
        AppConfig {
            database_url: self
                .database_url
                .expect("DATABASE_URL must be set"),
            redis_url: self
                .redis_url
                .expect("REDIS_URL must be set"),
        }
    }
}

// Singleton Pattern
static DB_CONNECTION: OnceLock<Mutex<PgConnection>> = OnceLock::new();

// Factory Pattern
pub fn establish_connection() -> PgConnection {
    let config = AppConfigBuilder::new().build();

    PgConnection::establish(&config.database_url)
        .expect(&format!("Error connecting to {}", config.database_url))
}

/// Singleton getter
pub fn get_db_connection() -> &'static Mutex<PgConnection> {
    DB_CONNECTION.get_or_init(|| {
        let conn = establish_connection();
        Mutex::new(conn)
    })
}

pub fn get_redis_url() -> String {
    let config = AppConfigBuilder::new().build();
    config.redis_url
}
