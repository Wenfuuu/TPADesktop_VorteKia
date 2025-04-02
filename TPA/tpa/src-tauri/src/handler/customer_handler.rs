use crate::models::customer::Customer;
use crate::db::establish_connection;
use crate::diesel::prelude::*;
use crate::models::user::CurrentUser;
use tauri::State;
use uuid::Uuid;

#[tauri::command]
pub fn get_current_customer(current_user: State<CurrentUser>) -> Option<Customer>{
    return current_user.customer.lock().unwrap().clone()
}

pub fn get_customer(customerid: &str) -> Result<Customer, diesel::result::Error> {
    println!("getting customer {}", customerid);
    use crate::schema::customers::dsl::*;
    let conn = &mut establish_connection();

    let customer = customers.filter(customer_id.eq(customerid))
    .first::<Customer>(conn)?;

    Ok(customer)
}

#[tauri::command]
pub fn login_customer(customerid: &str, current_user: State<CurrentUser>) -> bool{
    println!("logging in customer {}", customerid);
    match get_customer(customerid) {
        Ok(customer) =>{
            current_user.customer.lock().unwrap().replace(customer);
            true
        },
        Err(e) =>{
            println!("Error: {}", e);
            false
        }
    }
}

#[tauri::command]
pub fn logout_customer(current_user: State<CurrentUser>) -> bool {
    let mut customer_lock = current_user.customer.lock().unwrap();
    if customer_lock.is_some() {
        println!("Logging out customer");
        *customer_lock = None; // Clear the logged-in customer
        true
    } else {
        println!("No customer is logged in");
        false
    }
}

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
