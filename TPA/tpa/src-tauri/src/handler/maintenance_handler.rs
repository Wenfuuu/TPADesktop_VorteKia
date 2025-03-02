use uuid::Uuid;

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
    };

    diesel::insert_into(maintenances)
        .values(&new_maintenance)
        .execute(conn)
        .map(|_| true)
        .map_err(|err| format!("Database error: {}", err))
}