use crate::db::establish_connection;
use crate::diesel::prelude::*;
use crate::models::staff::Staff;
use crate::models::user::CurrentUser;
use bcrypt::{hash, verify, DEFAULT_COST};
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
    let hashed_pass = match hash(pass, DEFAULT_COST) {
        Ok(hashed) => hashed,
        Err(_) => {
            eprintln!("Failed to hash password");
            return false;
        }
    };

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
    // Ok(staff)
    if verify(pass, &staff.password).unwrap_or(false) {
        Ok(staff)
    } else {
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