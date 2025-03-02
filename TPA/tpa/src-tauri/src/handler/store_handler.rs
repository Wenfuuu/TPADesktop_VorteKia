use crate::models::store::{Store, StoreDTO};
use crate::db::establish_connection;
use crate::diesel::prelude::*;
use chrono::NaiveTime;

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