use uuid::Uuid;

use crate::handler::ride_handler::set_ride_maintenance;
use crate::models::report::Report;
use crate::db::establish_connection;
use crate::diesel::prelude::*;

#[tauri::command]
pub fn request_maintenance(
    rideid: &str,
    staffid: &str,
    maintenancereason: &str,
) -> Result<bool, String> {
    println!("test reporting for {rideid}");
    use crate::schema::reports::dsl::*;
    let conn = &mut establish_connection();

    let new_report = Report {
        report_id: format!("RPRT-{}", &Uuid::new_v4().to_string()[..8]),
        ride_id: rideid.to_string(),
        staff_id: staffid.to_string(),
        reason: maintenancereason.to_string(),
        status: "Pending".to_string()
    };

    diesel::insert_into(reports)
        .values(&new_report)
        .execute(conn)
        .map(|_| true)
        .map_err(|err| format!("Database error: {}", err))
}

#[tauri::command]
pub fn accept_report(reportid: &str, rideid: &str) -> Result<bool, String>{
    println!("accepting report {}", reportid);
    use crate::schema::reports::dsl::*;
    let conn = &mut establish_connection();

    let update_query = diesel::update(reports)
        .filter(report_id.eq(reportid))
        .set(status.eq("Approved".to_string()));

    //create tasks
    

    match set_ride_maintenance(rideid) {
        Ok(_) => (),
        Err(e) => return Err(format!("Error setting ride maintenance: {}", e)),
    }

    match update_query.execute(conn) {
        Ok(_) => Ok(true), // Successfully updated
        Err(e) => Err(format!("Error accepting report: {}", e)),
    }
}

#[tauri::command]
pub fn reject_report(reportid: &str) -> Result<bool, String>{
    println!("rejecting report {}", reportid);
    use crate::schema::reports::dsl::*;
    let conn = &mut establish_connection();

    let update_query = diesel::update(reports)
        .filter(report_id.eq(reportid))
        .set(status.eq("Rejected".to_string()));

    match update_query.execute(conn) {
        Ok(_) => Ok(true), // Successfully updated
        Err(e) => Err(format!("Error rejecting report: {}", e)),
    }
}

#[tauri::command]
pub fn get_all_reports() -> Result<Vec<Report>, String>{
    println!("getting all reports");
    use crate::schema::reports::dsl::*;
    let conn = &mut establish_connection();

    reports
        .load::<Report>(conn)
        .map_err(|err| format!("Database error: {}", err))
}