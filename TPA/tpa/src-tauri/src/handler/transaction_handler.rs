use uuid::Uuid;
use crate::models::ride_transaction::RideTransaction;
use crate::models::restaurant_transaction::RestaurantTransaction;
use crate::db::establish_connection;
use crate::diesel::prelude::*;

#[tauri::command]
pub fn create_restaurant_transaction(
    customerid: &str,
    restaurantid: &str,
    menuid: &str,
    qty: i32,
    totalprice: i32
) -> Result<bool, String> {
    use crate::schema::restaurant_transactions::dsl::*;
    let conn = &mut establish_connection();

    let new_transaction = RestaurantTransaction {
        transaction_id: format!("TRANS-{}", &Uuid::new_v4().to_string()[..8]),
        customer_id: customerid.to_string(),
        restaurant_id: restaurantid.to_string(),
        menu_id: menuid.to_string(),
        quantity: qty,
        total: totalprice
    };

    diesel::insert_into(restaurant_transactions)
        .values(&new_transaction)
        .execute(conn)
        .map(|_| true)
        .map_err(|err| format!("Database error: {}", err))
}

#[tauri::command]
pub fn create_ride_transaction(
    customerid: &str,
    rideid: &str,
    priceamount: i32,
) -> Result<bool, String> {
    use crate::schema::ride_transactions::dsl::*;
    let conn = &mut establish_connection();

    let new_transaction = RideTransaction {
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
pub fn get_transaction_by_ride(rideid: &str) -> Result<Vec<RideTransaction>, String> {
    use crate::schema::ride_transactions::dsl::*;
    let conn = &mut establish_connection();

    ride_transactions
        .filter(ride_id.eq(rideid))
        .load::<RideTransaction>(conn)
        .map_err(|err| format!("Database error: {}", err))
}

#[tauri::command]
pub fn get_transaction_by_restaurant(restaurantid: &str) -> Result<Vec<RestaurantTransaction>, String> {
    use crate::schema::restaurant_transactions::dsl::*;
    let conn = &mut establish_connection();

    restaurant_transactions
        .filter(restaurant_id.eq(restaurantid))
        .load::<RestaurantTransaction>(conn)
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
pub fn get_all_customer_restaurant_transactions(customerid: &str) -> Result<Vec<RestaurantTransaction>, String> {
    use crate::schema::restaurant_transactions::dsl::*;
    let conn = &mut establish_connection();

    restaurant_transactions
        .filter(customer_id.eq(customerid))
        .load::<RestaurantTransaction>(conn)
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