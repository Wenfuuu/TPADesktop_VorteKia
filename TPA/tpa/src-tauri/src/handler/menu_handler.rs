use uuid::Uuid;

use crate::models::menu::Menu;
use crate::db::establish_connection;
use crate::diesel::prelude::*;

#[tauri::command]
pub fn add_menu(
    restaurantid: &str,
    menuname: &str,
    menuprice: i32,
    menuimage: Option<Vec<u8>>,
) -> Result<bool, String> {
    println!("test creating menu {menuname}");
    use crate::schema::menus::dsl::*;
    let conn = &mut establish_connection();

    let new_menu = Menu {
        menu_id: format!("MENU-{}", &Uuid::new_v4().to_string()[..8]),
        restaurant_id: restaurantid.to_string(),
        name: menuname.to_string(),
        price: menuprice,
        image: menuimage,
    };

    diesel::insert_into(menus)
        .values(&new_menu)
        .execute(conn)
        .map(|_| true)
        .map_err(|err| format!("Database error: {}", err))
}

#[tauri::command]
pub fn update_menu(
    menuid: &str,
    menuname: &str,
    menuprice: i32,
    menuimage: Option<Vec<u8>>,
) -> Result<bool, String> {
    println!("test updating menu {menuname}");
    use crate::schema::menus::dsl::*;
    let conn = &mut establish_connection();

    let update_query = diesel::update(menus)
        .filter(menu_id.eq(menuid))
        .set((
            name.eq(menuname),
            price.eq(menuprice),
            image.eq(menuimage),
        ));

    match update_query.execute(conn) {
        Ok(_) => Ok(true), // Successfully updated
        Err(e) => Err(format!("Error updating menu: {}", e)),
    }
}

#[tauri::command]
pub fn delete_menu(
    menuid: &str
) -> Result<bool, String>{
    println!("deleting menu {menuid}");
    use crate::schema::menus::dsl::*;
    let conn = &mut establish_connection();

    diesel::delete(menus.filter(menu_id.eq(menuid)))
        .execute(conn)
        .map(|_| true)
        .map_err(|err| format!("Database error: {}", err))
}

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