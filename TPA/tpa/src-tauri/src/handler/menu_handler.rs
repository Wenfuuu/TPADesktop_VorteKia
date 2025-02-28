use crate::models::menu::Menu;
use crate::db::establish_connection;
use crate::diesel::prelude::*;

#[tauri::command]
pub fn get_menus_by_restaurant(restaurantid: String) -> Result<Vec<Menu>, String> {
    println!("getting menus for restaurant {}", restaurantid);
    use crate::schema::menus::dsl::*;
    let conn = &mut establish_connection();

    menus
        .filter(restaurant_id.eq(restaurantid))
        .load::<Menu>(conn)
        .map_err(|err| format!("Database error: {}", err))
}