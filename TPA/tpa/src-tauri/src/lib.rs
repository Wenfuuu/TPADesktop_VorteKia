use models::user::CurrentUser;
use serde::{Deserialize, Serialize};
use std::fs;
use std::sync::Mutex;
use crate::handler::customer_handler::*;
use crate::handler::lost_and_found_handler::*;
use crate::handler::staff_handler::*;
use crate::handler::restaurant_handler::*;
use crate::handler::menu_handler::*;
use crate::handler::store_handler::*;
use crate::handler::souvenir_handler::*;
use crate::handler::proposal_handler::*;
use crate::handler::ride_handler::*;
use crate::handler::report_handler::*;

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

#[warn(dead_code)]
fn seeding(){
    println!("seeding data");
    // register_staff("titi", "ti24-2", "f&b supervisor");
    // register_staff("betty", "bt24-2", "chef");
    // register_staff("kepin", "kh24-2", "waiter");
    // register_staff("aldric", "ac24-2", "lost and found staff");
    // register_staff("liman", "ws24-2", "retail manager");
    // register_staff("ryu", "ru24-2", "sales associate");
    // register_staff("aceh", "ww24-2", "ride manager");
    // register_staff("octa", "ov24-2", "ride staff");
    // register_staff("om", "gn24-2", "maintenance manager");
    // register_staff("tommy", "mm24-2", "maintenance staff");
    // register_staff("ireng", "vd24-2", "maintenance staff");
    // create_customer("paula");
    // create_lost_item("tribbie", "anak kecil", "red", "hsr", "paula", "Missing");
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // create_customer("weel");
    let current_user = CurrentUser{
        customer: Mutex::new(None),
        staff: Mutex::new(None)
    };

    seeding();

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
            get_all_staffs,
            get_all_restaurant_staffs,
            get_all_store_staffs,
            get_all_ride_staffs,
            get_all_maintenance_staffs,
            get_all_restaurants,
            get_menus_by_restaurant,
            allocate_restaurant_staff,
            get_allocated_staff_in_restaurant,
            update_restaurant,
            add_menu,
            update_menu,
            delete_menu,
            get_all_stores,
            update_store,
            allocate_store_staff,
            get_allocated_staff_in_store,
            get_souvenirs_by_store,
            add_souvenir,
            update_souvenir,
            delete_souvenir,
            propose_store_removal,
            get_all_rides,
            update_ride,
            allocate_ride_staff,
            get_allocated_staff_in_ride,
            propose_ride_removal,
            request_maintenance,
            get_all_reports,
            accept_report,
            reject_report,
            get_allocated_staff_in_report,
            propose_new_ride,
            test_backend
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
