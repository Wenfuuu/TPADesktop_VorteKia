use crate::handler::transaction_handler::create_restaurant_transaction;
use crate::models::order::Order;
use crate::db::establish_connection;
use crate::diesel::prelude::*;
use uuid::Uuid;

#[tauri::command]
pub fn create_order(
    restaurantid: &str,
    menuid: &str,
    customerid: &str,
    quantity: i32,
    price: i32
) -> Result<bool, String> {
    use crate::schema::orders::dsl::*;
    use crate::schema::customers;
    let conn = &mut establish_connection();

    //get customer balance
    let balance = customers::table
        .filter(customers::customer_id.eq(&customerid))
        .select(customers::balance)
        .first::<i32>(conn)
        .map_err(|err| format!("Database error: {}", err))?;
    println!("customer current balance is {balance}");

    if balance < price {
        return Err("Insufficient balance".to_string());
    }

    // deduct the price from customer balance
    diesel::update(customers::table)
        .filter(customers::customer_id.eq(&customerid))
        .set(customers::balance.eq(customers::balance - price))
        .execute(conn)
        .map_err(|err| format!("Database error: {}", err))?;

    // status => Pending, Cooking, Ready to Serve, Complete
    let new_order = Order {
        order_id: format!("ORDER-{}", &Uuid::new_v4().to_string()[..8]),
        restaurant_id: restaurantid.to_string(),
        menu_id: menuid.to_string(),
        customer_id: customerid.to_string(),
        assigned_to: None,
        status: "Pending".to_string()
    };

    let _ = create_restaurant_transaction(
        customerid,
        restaurantid,
        menuid,
        quantity,
        price
    );

    diesel::insert_into(orders)
        .values(&new_order)
        .execute(conn)
        .map(|_| true)
        .map_err(|err| format!("Database error: {}", err))
}

#[tauri::command]
pub fn assign_order(orderid: &str, staffid: &str) -> Result<bool, String> {
    println!("assigning order {}", orderid);
    use crate::schema::orders::dsl::*;
    let conn = &mut establish_connection();

    let update_query = diesel::update(orders)
        .filter(order_id.eq(orderid))
        .set((
            status.eq("Cooking".to_string()),
            assigned_to.eq(staffid.to_string())
        ));

    match update_query.execute(conn) {
        Ok(_) => Ok(true),
        Err(e) => Err(format!("Error assigning order: {}", e)),
    }
}

#[tauri::command]
pub fn mark_order_ready(orderid: &str) -> Result<bool, String> {
    println!("marking order {} as ready", orderid);
    use crate::schema::orders::dsl::*;
    let conn = &mut establish_connection();

    let update_query = diesel::update(orders)
        .filter(order_id.eq(orderid))
        .set(status.eq("Ready to Serve".to_string()));

    match update_query.execute(conn) {
        Ok(_) => Ok(true),
        Err(e) => Err(format!("Error marking order as ready: {}", e)),
    }
}

#[tauri::command]
pub fn complete_order(orderid: &str) -> Result<bool, String> {
    println!("completing order {}", orderid);
    use crate::schema::orders::dsl::*;
    let conn = &mut establish_connection();

    let update_query = diesel::update(orders)
        .filter(order_id.eq(orderid))
        .set(status.eq("Complete".to_string()));

    match update_query.execute(conn) {
        Ok(_) => Ok(true),
        Err(e) => Err(format!("Error completing order: {}", e)),
    }
}

#[tauri::command]
pub fn get_assigned_orders(staffid: &str) -> Result<Vec<Order>, String> {
    println!("getting assigned orders for {}", staffid);
    use crate::schema::orders::dsl::*;
    let conn = &mut establish_connection();

    orders
        .filter(assigned_to.eq(staffid))
        .load::<Order>(conn)
        .map_err(|err| format!("Error loading orders: {}", err))
}

#[tauri::command]
pub fn get_all_orders() -> Result<Vec<Order>, String> {
    println!("getting all orders");
    use crate::schema::orders::dsl::*;
    let conn = &mut establish_connection();

    orders
        .load::<Order>(conn)
        .map_err(|err| format!("Error loading orders: {}", err))
}