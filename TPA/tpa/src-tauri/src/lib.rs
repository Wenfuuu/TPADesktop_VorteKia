use models::user::CurrentUser;
use serde::{Deserialize, Serialize};
use std::fs;
use std::sync::Mutex;
use crate::handler::customer_handler::*;
use crate::handler::lost_and_found_handler::*;
use crate::handler::staff_handler::*;
use crate::handler::restaurant_handler::*;
use crate::handler::menu_handler::*;

extern crate diesel;

mod schema;
mod db;
mod models;
mod handler;

#[derive(Deserialize, Serialize)]
struct Config {
    device_id: String,
}

fn read_config() -> Config {
    let path = "./config.json";
    let config_str = fs::read_to_string(path).expect("Failed to read config file");
    serde_json::from_str(&config_str).expect("Invalid JSON format")
}

#[tauri::command]
fn get_device_id() -> String {
    let config = read_config();
    config.device_id
}

#[tauri::command]
fn test_backend(){
    println!("Backend function was called!");
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // create_customer("weel");
    let current_user = CurrentUser{
        customer: Mutex::new(None),
        staff: Mutex::new(None)
    };

    // register_staff("titi", "ti24-2", "ceo");
    // create_customer("paula");

    tauri::Builder::default()
        .manage(current_user)
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            get_device_id,
            get_all_customers,
            create_customer,
            get_all_lost_items,
            create_lost_item,
            update_lost_item,
            login_staff,
            get_current_staff,
            register_staff,
            get_all_restaurants,
            get_menus_by_restaurant,
            update_restaurant,
            test_backend
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
