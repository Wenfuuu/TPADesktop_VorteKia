use uuid::Uuid;

use crate::handler::report_handler::{complete_report, reassign_report};
use crate::handler::ride_handler::update_ride_status;
use crate::handler::task_handler::reassign_task;
use crate::models::maintenance_log::MaintenanceLog;
use crate::db::establish_connection;
use crate::diesel::prelude::*;
use crate::models::report::Report;
use crate::models::task::Task;
use crate::schema::{reports, tasks};

use super::task_handler::complete_task;

#[tauri::command]
pub fn add_report_log(
    reportid: &str,
    staffid: &str
) -> Result<bool, String> {
    println!("test creating task log");
    use crate::schema::maintenance_logs::dsl::*;
    let conn = &mut establish_connection();

    let new_log = MaintenanceLog {
        log_id: format!("LOG-{}", &Uuid::new_v4().to_string()[..8]),
        staff_id: staffid.to_string(),
        report_id: Some(reportid.to_string()),
        task_id: None,
        status: "On Review".to_string()
    };

    diesel::insert_into(maintenance_logs)
        .values(&new_log)
        .execute(conn)
        .map(|_| true)
        .map_err(|err| format!("Database error: {}", err))
}

#[tauri::command]
pub fn add_task_log(
    taskid: &str,
    staffid: &str
) -> Result<bool, String> {
    println!("test creating task log");
    use crate::schema::maintenance_logs::dsl::*;
    let conn = &mut establish_connection();

    let new_log = MaintenanceLog {
        log_id: format!("LOG-{}", &Uuid::new_v4().to_string()[..8]),
        staff_id: staffid.to_string(),
        report_id: None,
        task_id: Some(taskid.to_string()),
        status: "On Review".to_string()
    };

    diesel::insert_into(maintenance_logs)
        .values(&new_log)
        .execute(conn)
        .map(|_| true)
        .map_err(|err| format!("Database error: {}", err))
}

#[tauri::command]
pub fn revise_task_log(logid: &str, taskid: &str) -> Result<bool, String> {
    println!("revising task log");
    use crate::schema::maintenance_logs::dsl::*;
    let conn = &mut establish_connection();

    let update_query = diesel::update(maintenance_logs)
        .filter(log_id.eq(logid))
        .set(status.eq("Revised".to_string()));

    // set task to in progress again
    match reassign_task(taskid) {
        Ok(_) => (),
        Err(e) => return Err(format!("Error reassigning task: {}", e)),
    }

    match update_query.execute(conn) {
        Ok(_) => Ok(true),
        Err(e) => Err(format!("Error revising log: {}", e)),
    }
}

#[tauri::command]
pub fn approve_task_log(logid: &str, taskid: &str) -> Result<bool, String> {
    println!("approving task log");
    use crate::schema::maintenance_logs::dsl::*;
    let conn = &mut establish_connection();

    let update_query = diesel::update(maintenance_logs)
        .filter(log_id.eq(logid))
        .set(status.eq("Approved".to_string()));

    // set task to completed
    match complete_task(taskid) {
        Ok(_) => (),
        Err(e) => return Err(format!("Error completing task: {}", e)),
    }

    let task = tasks::table
        .filter(tasks::task_id.eq(taskid))
        .first::<Task>(conn)
        .map_err(|err| format!("Database error: {}", err))?;
    //set ride to open status
    match update_ride_status(&task.ride_id, "Open") {
        Ok(_) => (),
        Err(e) => return Err(format!("Error setting ride open: {}", e)),
    }

    match update_query.execute(conn) {
        Ok(_) => Ok(true),
        Err(e) => Err(format!("Error approving log: {}", e)),
    }
}

#[tauri::command]
pub fn revise_report_log(logid: &str, reportid: &str) -> Result<bool, String> {
    println!("reassigning report log");
    use crate::schema::maintenance_logs::dsl::*;
    let conn = &mut establish_connection();

    let update_query = diesel::update(maintenance_logs)
        .filter(log_id.eq(logid))
        .set(status.eq("Revised".to_string()));

    // set report to in progress again
    match reassign_report(reportid) {
        Ok(_) => (),
        Err(e) => return Err(format!("Error reassigning report: {}", e)),
    }

    match update_query.execute(conn) {
        Ok(_) => Ok(true),
        Err(e) => Err(format!("Error revising log: {}", e)),
    }
}

#[tauri::command]
pub fn approve_report_log(logid: &str, reportid: &str) -> Result<bool, String> {
    println!("approving report log");
    use crate::schema::maintenance_logs::dsl::*;
    let conn = &mut establish_connection();

    let update_query = diesel::update(maintenance_logs)
        .filter(log_id.eq(logid))
        .set(status.eq("Approved".to_string()));

    // set report to completed
    match complete_report(reportid) {
        Ok(_) => (),
        Err(e) => return Err(format!("Error completing report: {}", e)),
    }

    let report = reports::table
        .filter(reports::report_id.eq(reportid))
        .first::<Report>(conn)
        .map_err(|err| format!("Database error: {}", err))?;
    //set ride to open status
    match update_ride_status(&report.ride_id, "Open") {
        Ok(_) => (),
        Err(e) => return Err(format!("Error setting ride open: {}", e)),
    }

    match update_query.execute(conn) {
        Ok(_) => Ok(true),
        Err(e) => Err(format!("Error approving log: {}", e)),
    }
}

#[tauri::command]
pub fn get_all_logs() -> Result<Vec<MaintenanceLog>, String> {
    println!("getting all logs");
    use crate::schema::maintenance_logs::dsl::*;
    let conn = &mut establish_connection();

    maintenance_logs
        .load::<MaintenanceLog>(conn)
        .map_err(|err| format!("Database error: {}", err))
}