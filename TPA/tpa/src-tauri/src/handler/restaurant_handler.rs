use crate::models::restaurant::{Restaurant, RestaurantDTO};
use crate::db::establish_connection;
use crate::diesel::prelude::*;
use chrono::NaiveTime;

#[tauri::command]
pub fn update_restaurant(
    id: &str,
    new_name: &str,
    new_cuisine_type: &str,
    new_opening_hours: &str,
    new_closing_hours: &str,
    new_status: &str,
    newimagedata: Option<Vec<u8>>,
) -> Result<bool, String>{
  // update restaurant based on id
    println!("test updating restaurant {id}");
    use crate::schema::restaurants::dsl::*;
    let conn = &mut establish_connection();

    // Convert time strings to NaiveTime
    let opening_time = NaiveTime::parse_from_str(new_opening_hours, "%H:%M:%S")
        .map_err(|e| format!("Invalid opening time format: {}", e))?;
    let closing_time = NaiveTime::parse_from_str(new_closing_hours, "%H:%M:%S")
        .map_err(|e| format!("Invalid closing time format: {}", e))?;

    let update_query = diesel::update(restaurants)
        .filter(restaurant_id.eq(id))
        .set((
            name.eq(new_name),
            cuisine_type.eq(new_cuisine_type),
            opening_hours.eq(opening_time),
            closing_hours.eq(closing_time),
            status.eq(new_status),
            image.eq(newimagedata)
        ));

    match update_query.execute(conn) {
        Ok(_) => Ok(true), // Successfully updated
        Err(e) => Err(format!("Error updating item: {}", e)),
    }
}

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