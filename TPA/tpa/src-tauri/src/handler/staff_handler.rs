use crate::db::establish_connection;
use crate::diesel::prelude::*;
use crate::models::staff::Staff;
use crate::models::user::CurrentUser;
use argon2::{password_hash::{rand_core::OsRng, PasswordHasher, PasswordVerifier, SaltString}, Argon2, PasswordHash};
use serde::Serialize;
use tauri::State;
use uuid::Uuid;

#[derive(Queryable, Serialize)]
pub struct StaffInfo {
    pub name: String,
    pub role: String,
}

#[tauri::command]
pub fn get_current_staff(current_user: State<CurrentUser>) -> Option<Staff>{
    return current_user.staff.lock().unwrap().clone()
}

#[tauri::command]
pub fn register_staff(staffname: &str, pass: &str, staffrole: &str) -> bool {
    println!("creating staff");
    use crate::schema::staffs::dsl::*;
    let conn = &mut establish_connection(); 
    // let hashed_pass = match hash(pass, DEFAULT_COST) {
    //     Ok(hashed) => hashed,
    //     Err(_) => {
    //         eprintln!("Failed to hash password");
    //         return false;
    //     }
    // };

    // Generate a random salt
    let salt = SaltString::generate(&mut OsRng);

    // Create an Argon2 password hasher
    let argon2 = Argon2::default();

    // Hash the password with the salt
    let hashed_pass = argon2.hash_password(pass.as_bytes(), &salt).unwrap().to_string();

    let new_staff = Staff {
        staff_id: format!("STAFF-{}", &Uuid::new_v4().to_string()[..8]),
        name: staffname.to_string(),
        password: hashed_pass,
        role: staffrole.to_string()
    };
    // println!("{}", new_staff.password);

    diesel::insert_into(staffs)
        .values(&new_staff)
        .execute(conn)
        .map(|_| true)
        .unwrap_or(false)
}

pub fn get_staff(staffid: &str, pass: &str) -> Result<Staff, diesel::result::Error>{
    println!("getting staff {}", staffid);
    use crate::schema::staffs::dsl::*;

    let conn = &mut establish_connection();

    let staff = staffs.filter(staff_id.eq(staffid))
    .first::<Staff>(conn)?;

    println!("{}", pass);

    // Verify the password using Argon2
    let parsed_hash = PasswordHash::new(&staff.password)
        .map_err(|_| diesel::result::Error::NotFound)?;

    let argon2 = Argon2::default();
    if argon2.verify_password(pass.as_bytes(), &parsed_hash).is_ok() {
        println!("Password verified successfully!");
        Ok(staff)
    } else {
        println!("Invalid password!");
        Err(diesel::result::Error::NotFound)
    }
}

#[tauri::command]
pub fn login_staff(staffid: &str, pass: &str, current_user: State<CurrentUser>) -> bool{
    println!("logging in staff {}, {}", staffid, pass);
    match get_staff(staffid, pass) {
        Ok(staff) =>{
            current_user.staff.lock().unwrap().replace(staff);
            true
        },
        Err(e) =>{
            println!("Error: {}", e);
            false
        }
    }
}