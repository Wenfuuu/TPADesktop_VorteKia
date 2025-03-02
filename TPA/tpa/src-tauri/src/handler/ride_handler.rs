use crate::models::ride::{Ride, RideDTO};
use crate::db::establish_connection;
use crate::diesel::prelude::*;
use crate::schema::ride_staffs;
use chrono::NaiveTime;

#[tauri::command]
pub fn allocate_ride_staff(ride_id: &str, staff_ids: Vec<&str>) -> Result<bool, String> {
    println!("Allocating staff to ride {ride_id}");
    let conn = &mut establish_connection();

    // Remove existing staff
    diesel::delete(ride_staffs::table)
        .filter(ride_staffs::ride_id.eq(ride_id))
        .execute(conn)
        .map_err(|e| format!("Error removing previous assignments: {}", e))?;

    // Insert new assignments
    let new_assignments: Vec<_> = staff_ids
        .iter()
        .map(|staff_id| (ride_staffs::ride_id.eq(ride_id), crate::schema::ride_staffs::staff_id.eq(staff_id)))
        .collect();

    diesel::insert_into(ride_staffs::table)
        .values(&new_assignments)
        .execute(conn)
        .map_err(|e| format!("Error assigning staff: {}", e))?;

    Ok(true)
}

#[tauri::command]
pub fn update_ride(
    id: &str,
    new_name: &str,
    new_price: i32,
    new_opening_hours: &str,
    new_closing_hours: &str,
    new_status: &str,
    newimagedata: Option<Vec<u8>>,
) -> Result<bool, String> {
    println!("Updating ride {id}");
    use crate::schema::rides::dsl::*;
    let conn = &mut establish_connection();

    // Convert time strings to NaiveTime
    let opening_time = NaiveTime::parse_from_str(new_opening_hours, "%H:%M:%S")
        .map_err(|e| format!("Invalid opening time format: {}", e))?;
    let closing_time = NaiveTime::parse_from_str(new_closing_hours, "%H:%M:%S")
        .map_err(|e| format!("Invalid closing time format: {}", e))?;

    let update_query = diesel::update(rides)
        .filter(ride_id.eq(id))
        .set((
            name.eq(new_name),
            price.eq(new_price),
            opening_hours.eq(opening_time),
            closing_hours.eq(closing_time),
            status.eq(new_status),
            image.eq(newimagedata),
        ));

    match update_query.execute(conn) {
        Ok(_) => Ok(true),
        Err(e) => Err(format!("Error updating ride: {}", e)),
    }
}

#[tauri::command]
pub fn get_all_rides() -> Result<Vec<RideDTO>, String> {
    println!("Fetching all rides");
    use crate::schema::rides::dsl::*;
    let conn = &mut establish_connection();

    match rides.load::<Ride>(conn) {
        Ok(results) => {
            let dto_results: Vec<RideDTO> = results.into_iter().map(|s| s.into()).collect();
            Ok(dto_results)
        }
        Err(e) => {
            eprintln!("Error fetching stores: {}", e);
            Err(e.to_string())
        }
    }
}