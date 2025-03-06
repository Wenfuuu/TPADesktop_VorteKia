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
use crate::handler::task_handler::*;
use crate::handler::maintenance_log_handler::*;
use crate::handler::ride_queue_handler::*;
use crate::handler::chat_handler::*;

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
        .manage(init_firebase_client()) // Initialize Firebase client
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
            update_restaurant_status,
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
            get_assigned_reports,
            accept_report,
            reject_report,
            submit_report,
            propose_new_ride,
            get_all_tasks,
            get_assigned_tasks,
            update_task_schedule,
            create_task,
            submit_task,
            add_task_log,
            add_report_log,
            get_all_logs,
            approve_task_log,
            approve_report_log,
            revise_task_log,
            revise_report_log,
            get_assigned_ride,
            get_ride_queue,
            add_queue,
            update_queue,
            remove_queue,
            send_chat_message,
            get_chat_messages,
            update_ride_status,
            update_store_status,
            test_backend
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}