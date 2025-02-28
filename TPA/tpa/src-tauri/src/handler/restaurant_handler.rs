use crate::models::restaurant::{Restaurant, RestaurantDTO};
use crate::db::establish_connection;
use crate::diesel::prelude::*;

#[tauri::command]
pub fn get_all_restaurants() -> Result<Vec<RestaurantDTO>, String> {
    print!("getting all restaurants");
    use crate::schema::restaurants::dsl::*;
    let conn = &mut establish_connection();

    match restaurants.load::<Restaurant>(conn) {
        Ok(results) => {
            let dto_results: Vec<RestaurantDTO> = results.into_iter().map(|r| r.into()).collect();
            Ok(dto_results)
        }
        Err(e) => {
            eprintln!("Error fetching restaurants: {}", e);
            Err(e.to_string())
        }
    }
}