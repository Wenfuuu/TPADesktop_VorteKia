
use uuid::Uuid;

use crate::db::establish_connection;
use crate::diesel::prelude::*;
use crate::models::lost_and_found_item::LostAndFound;

#[tauri::command]
pub fn get_all_lost_items() -> Result<Vec<LostAndFound>, String> {
    print!("getting all lost items");
    use crate::schema::lostandfounditems::dsl::*;
    let conn = &mut establish_connection();
    lostandfounditems
        .load::<LostAndFound>(conn)
        .map_err(|e| e.to_string())
}

#[tauri::command]
pub fn create_lost_item(
    new_name: &str,
    new_type: &str,
    new_color: &str,
    new_last_seen: &str,
    new_owner: &str,
    new_status: &str
) -> bool {
    println!("test creating lost item {new_name}");
    use crate::schema::lostandfounditems::dsl::*;
    let conn = &mut establish_connection();

    let new_lost_item = LostAndFound {
        item_id: format!("LOST-{}", &Uuid::new_v4().to_string()[..8]),
        name: new_name.to_string(),
        item_type: new_type.to_string(),
        color: new_color.to_string(),
        last_seen_location: new_last_seen.to_string(),
        found_location: None,
        owner: new_owner.to_string(),
        finder: None,
        status: new_status.to_string(),
        image: None
    };

    diesel::insert_into(lostandfounditems)
        .values(&new_lost_item)
        .execute(conn)
        .map(|_| true)
        .unwrap_or(false)
}

#[tauri::command]
pub fn update_lost_item(
    id: &str,
    new_name: &str,
    new_item_type: &str,
    new_color: &str,
    new_last_seen: &str,
    new_found_location: &str,
    new_finder: &str,
    new_owner: &str,
    new_status: &str,
    newimagedata: Option<Vec<u8>>,
) -> Result<bool, String> {
    println!("updating item id {}", id);
    use crate::schema::lostandfounditems::dsl::*;
    let conn = &mut establish_connection();

    let update_query = diesel::update(lostandfounditems)
        .filter(item_id.eq(id))
        .set((
            name.eq(new_name),
            item_type.eq(new_item_type),
            color.eq(new_color),
            last_seen_location.eq(new_last_seen),
            found_location.eq(new_found_location),
            finder.eq(new_finder),
            owner.eq(new_owner),
            status.eq(new_status),
            image.eq(newimagedata)
        ));

    match update_query.execute(conn) {
        Ok(_) => Ok(true), // Successfully updated
        Err(e) => Err(format!("Error updating item: {}", e)),
    }
}