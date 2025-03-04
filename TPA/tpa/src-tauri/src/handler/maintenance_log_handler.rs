use uuid::Uuid;

use crate::handler::report_handler::complete_report;
use crate::models::maintenance_log::MaintenanceLog;
use crate::db::establish_connection;
use crate::diesel::prelude::*;

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

    match update_query.execute(conn) {
        Ok(_) => Ok(true),
        Err(e) => Err(format!("Error approving log: {}", e)),
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