use crate::models::customer::Customer;
use crate::db::establish_connection;
use crate::diesel::prelude::*;
use uuid::Uuid;

#[tauri::command]
pub fn get_all_customers() -> Result<Vec<Customer>, String> {
    print!("getting all customers");
    use crate::schema::customers::dsl::*;
    let conn = &mut establish_connection();
    customers
        .load::<Customer>(conn)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn create_customer(new_name: &str) -> bool{
    println!("test creating customer name {new_name}");
    use crate::schema::customers::dsl::*;
    let conn = &mut establish_connection();

    let new_customer = Customer{
        customer_id: format!("CUST-{}", &Uuid::new_v4().to_string()[..8]),
        name: new_name.to_string(),
        balance: 100000
    };

    diesel::insert_into(customers)
        .values(&new_customer)
        .execute(conn)
        .map(|_| true)
        .unwrap_or(false)
}
