use crate::models::store::{Store, StoreDTO};
use crate::db::establish_connection;
use crate::diesel::prelude::*;
use chrono::NaiveTime;

#[tauri::command]
pub fn allocate_store_staff(store_id: &str, staff_ids: Vec<&str>) -> Result<bool, String> {
    println!("Allocating staff to store {store_id}");
    use crate::schema::store_staffs;
    let conn = &mut establish_connection();

    // Remove existing staff
    diesel::delete(store_staffs::table)
        .filter(store_staffs::store_id.eq(store_id))
        .execute(conn)
        .map_err(|e| format!("Error removing previous assignments: {}", e))?;

    // Insert new assignments
    let new_assignments: Vec<_> = staff_ids
        .iter()
        .map(|staff_id| (store_staffs::store_id.eq(store_id), store_staffs::staff_id.eq(staff_id)))
        .collect();

    diesel::insert_into(store_staffs::table)
        .values(&new_assignments)
        .execute(conn)
        .map_err(|e| format!("Error assigning staff: {}", e))?;

    Ok(true)
}

#[tauri::command]
pub fn update_store_status(storeid: &str, newstatus: &str) -> Result<bool, String> {
    println!("Updating store status {storeid}");
    use crate::schema::stores::dsl::*;
    let conn = &mut establish_connection();

    let update_query = diesel::update(stores)
        .filter(store_id.eq(storeid))
        .set(status.eq(newstatus.to_string()));

    match update_query.execute(conn) {
        Ok(_) => Ok(true),
        Err(e) => Err(format!("Error updating item: {}", e)),
    }
}

#[tauri::command]
pub fn update_store(
    id: &str,
    new_name: &str,
    new_opening_hours: &str,
    new_closing_hours: &str,
    new_status: &str,
    newimagedata: Option<Vec<u8>>,
) -> Result<bool, String> {
    println!("Updating store {id}");
    use crate::schema::stores::dsl::*;
    let conn = &mut establish_connection();

    // Convert time strings to NaiveTime
    let opening_time = NaiveTime::parse_from_str(new_opening_hours, "%H:%M:%S")
        .map_err(|e| format!("Invalid opening time format: {}", e))?;
    let closing_time = NaiveTime::parse_from_str(new_closing_hours, "%H:%M:%S")
        .map_err(|e| format!("Invalid closing time format: {}", e))?;

    let update_query = diesel::update(stores)
        .filter(store_id.eq(id))
        .set((
            name.eq(new_name),
            opening_hours.eq(opening_time),
            closing_hours.eq(closing_time),
            status.eq(new_status),
            image.eq(newimagedata),
        ));

    match update_query.execute(conn) {
        Ok(_) => Ok(true),
        Err(e) => Err(format!("Error updating store: {}", e)),
    }
}

#[tauri::command]
pub fn get_store_details(storeid: &str) -> Result<StoreDTO, String> {
    println!("Fetching store details");
    use crate::schema::stores::dsl::*;
    let conn = &mut establish_connection();

    match stores.filter(store_id.eq(storeid)).first::<Store>(conn) {
        Ok(store) => Ok(store.into()),
        Err(e) => {
            eprintln!("Error fetching store: {}", e);
            Err(e.to_string())
        }
    }
}

#[tauri::command]
pub fn get_all_stores() -> Result<Vec<StoreDTO>, String> {
    println!("Fetching all stores");
    use crate::schema::stores::dsl::*;
    let conn = &mut establish_connection();

    match stores.load::<Store>(conn) {
        Ok(results) => {
            let dto_results: Vec<StoreDTO> = results.into_iter().map(|s| s.into()).collect();
            Ok(dto_results)
        }
        Err(e) => {
            eprintln!("Error fetching stores: {}", e);
            Err(e.to_string())
        }
    }
}

#[tauri::command]
pub fn get_assigned_store(staffid: &str) -> Result<StoreDTO, String> {
    println!("getting assigned store for staff {staffid}");
    use crate::schema::stores;
    use crate::schema::store_staffs;
    let conn = &mut establish_connection();

    let store = store_staffs::table
        .inner_join(stores::table.on(store_staffs::store_id.eq(stores::store_id)))
        .filter(store_staffs::staff_id.eq(staffid))
        .select(Store::as_select())
        .first::<Store>(conn)
        .map_err(|e| e.to_string())?;

    Ok(StoreDTO::from(store))
}