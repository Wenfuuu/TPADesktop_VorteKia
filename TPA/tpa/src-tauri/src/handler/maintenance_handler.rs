use uuid::Uuid;

use crate::handler::ride_handler::set_ride_maintenance;
use crate::models::maintenance::Maintenance;
use crate::db::establish_connection;
use crate::diesel::prelude::*;

#[tauri::command]
pub fn request_maintenance(
    rideid: &str,
    staffid: &str,
    maintenancereason: &str,
) -> Result<bool, String> {
    println!("test requesting maintenance for {rideid}");
    use crate::schema::maintenances::dsl::*;
    let conn = &mut establish_connection();

    let new_maintenance = Maintenance {
        maintenance_id: format!("MAIN-{}", &Uuid::new_v4().to_string()[..8]),
        ride_id: rideid.to_string(),
        staff_id: staffid.to_string(),
        reason: maintenancereason.to_string(),
        status: "Pending".to_string()
    };

    diesel::insert_into(maintenances)
        .values(&new_maintenance)
        .execute(conn)
        .map(|_| true)
        .map_err(|err| format!("Database error: {}", err))
}

// pub fn create_maintenance_task(maintenanceid: &str, staffid: &str) -> Result<bool, String>{

// }

#[tauri::command]
pub fn accept_maintenance(maintenanceid: &str, rideid: &str) -> Result<bool, String>{
    println!("accepting maintenance {}", maintenanceid);
    use crate::schema::maintenances::dsl::*;
    let conn = &mut establish_connection();

    let update_query = diesel::update(maintenances)
        .filter(maintenance_id.eq(maintenanceid))
        .set(status.eq("Approved".to_string()));

    match set_ride_maintenance(rideid) {
        Ok(_) => (),
        Err(e) => return Err(format!("Error setting ride maintenance: {}", e)),
    }

    //create tasks


    match update_query.execute(conn) {
        Ok(_) => Ok(true), // Successfully updated
        Err(e) => Err(format!("Error accepting maintenance: {}", e)),
    }
}

#[tauri::command]
pub fn reject_maintenance(maintenanceid: &str) -> Result<bool, String>{
    println!("rejecting maintenance {}", maintenanceid);
    use crate::schema::maintenances::dsl::*;
    let conn = &mut establish_connection();

    let update_query = diesel::update(maintenances)
        .filter(maintenance_id.eq(maintenanceid))
        .set(status.eq("Rejected".to_string()));

    match update_query.execute(conn) {
        Ok(_) => Ok(true), // Successfully updated
        Err(e) => Err(format!("Error rejecting maintenance: {}", e)),
    }
}

#[tauri::command]
pub fn get_all_maintenances() -> Result<Vec<Maintenance>, String>{
    println!("getting all maintenances");
    use crate::schema::maintenances::dsl::*;
    let conn = &mut establish_connection();

    maintenances
        .select((maintenance_id, ride_id, staff_id, reason, status))
        .load::<Maintenance>(conn)
        .map_err(|err| format!("Database error: {}", err))
}