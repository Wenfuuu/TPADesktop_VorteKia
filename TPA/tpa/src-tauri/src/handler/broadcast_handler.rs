use crate::models::broadcast::Broadcast;
use crate::db::establish_connection;
use crate::diesel::prelude::*;
use uuid::Uuid;

#[tauri::command]
pub fn broadcast_to_staff(msg: &str) -> Result<bool, String> {
    use crate::schema::broadcasts::dsl::*;
    let conn = &mut establish_connection();

    let new_broadcast = Broadcast {
        broadcast_id: format!("BROADCAST-{}", &Uuid::new_v4().to_string()[..8]),
        message: msg.to_string(),
        customer_id: None,
    };

    diesel::insert_into(broadcasts)
        .values(&new_broadcast)
        .execute(conn)
        .map(|_| true)
        .map_err(|err| format!("Database error: {}", err))
}

#[tauri::command]
pub fn broadcast_to_customer(msg: &str, customerid: &str) -> Result<bool, String> {
    use crate::schema::broadcasts::dsl::*;
    let conn = &mut establish_connection();

    let new_broadcast = Broadcast {
        broadcast_id: format!("BROADCAST-{}", &Uuid::new_v4().to_string()[..8]),
        message: msg.to_string(),
        customer_id: Some(customerid.to_string()),
    };

    diesel::insert_into(broadcasts)
        .values(&new_broadcast)
        .execute(conn)
        .map(|_| true)
        .map_err(|err| format!("Database error: {}", err))
}

#[tauri::command]
pub fn get_customer_broadcasts(customerid: &str) -> Result<Vec<Broadcast>, String> {
    use crate::schema::broadcasts::dsl::*;
    let conn = &mut establish_connection();

    broadcasts
        .filter(customer_id.eq(customerid))
        .load::<Broadcast>(conn)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn get_staff_broadcasts() -> Result<Vec<Broadcast>, String> {
    use crate::schema::broadcasts::dsl::*;
    let conn = &mut establish_connection();

    broadcasts
        .filter(customer_id.is_null())
        .load::<Broadcast>(conn)
        .map_err(|e| e.to_string())
}