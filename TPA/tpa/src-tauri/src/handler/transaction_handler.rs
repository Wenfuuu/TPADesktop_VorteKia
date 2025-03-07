use uuid::Uuid;

use crate::models::ride_transaction::RideTransaction;
use crate::db::establish_connection;
use crate::diesel::prelude::*;

#[tauri::command]
pub fn create_ride_transaction(
    customerid: &str,
    rideid: &str,
    priceamount: i32,
) -> Result<bool, String> {
    use crate::schema::ride_transactions::dsl::*;
    let conn = &mut establish_connection();

    let new_transaction = RideTransaction {
        // transaction_id: Uuid::new_v4().to_string(),
        transaction_id: format!("TRANS-{}", &Uuid::new_v4().to_string()[..8]),
        customer_id: customerid.to_string(),
        ride_id: rideid.to_string(),
        amount: priceamount,
    };

    diesel::insert_into(ride_transactions)
        .values(&new_transaction)
        .execute(conn)
        .map(|_| true)
        .map_err(|err| format!("Database error: {}", err))
}

#[tauri::command]
pub fn get_all_customer_ride_transactions(customerid: &str) -> Result<Vec<RideTransaction>, String> {
    use crate::schema::ride_transactions::dsl::*;
    let conn = &mut establish_connection();

    ride_transactions
        .filter(customer_id.eq(customerid))
        .load::<RideTransaction>(conn)
        .map_err(|err| format!("Database error: {}", err))
}

#[tauri::command]
pub fn get_all_ride_transactions() -> Result<Vec<RideTransaction>, String> {
    use crate::schema::ride_transactions::dsl::*;
    let conn = &mut establish_connection();

    ride_transactions
        .load::<RideTransaction>(conn)
        .map_err(|err| format!("Database error: {}", err))
}