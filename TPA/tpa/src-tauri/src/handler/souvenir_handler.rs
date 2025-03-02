use crate::models::souvenir::Souvenir;
use crate::db::establish_connection;
use crate::diesel::prelude::*;

#[tauri::command]
pub fn add_souvenir(
    storeid: &str,
    souvenirname: &str,
    souvenirprice: i32,
    souvenirimage: Option<Vec<u8>>,
) -> Result<bool, String> {
    println!("test creating souvenir {souvenirname}");
    use crate::schema::souvenirs::dsl::*;
    let conn = &mut establish_connection();

    let new_souvenir = Souvenir {
        souvenir_id: format!("SOUV-{}", &uuid::Uuid::new_v4().to_string()[..8]),
        store_id: storeid.to_string(),
        name: souvenirname.to_string(),
        price: souvenirprice,
        image: souvenirimage,
    };

    diesel::insert_into(souvenirs)
        .values(&new_souvenir)
        .execute(conn)
        .map(|_| true)
        .map_err(|err| format!("Database error: {}", err))
}

#[tauri::command]
pub fn update_souvenir(
    souvenirid: &str,
    souvenirname: &str,
    souvenirprice: i32,
    souvenirimage: Option<Vec<u8>>,
) -> Result<bool, String> {
    println!("test updating souvenir {souvenirname}");
    use crate::schema::souvenirs::dsl::*;
    let conn = &mut establish_connection();

    let update_query = diesel::update(souvenirs)
        .filter(souvenir_id.eq(souvenirid))
        .set((
            name.eq(souvenirname),
            price.eq(souvenirprice),
            image.eq(souvenirimage),
        ));

    match update_query.execute(conn) {
        Ok(_) => Ok(true), // Successfully updated
        Err(e) => Err(format!("Error updating souvenir: {}", e)),
    }
}

#[tauri::command]
pub fn delete_souvenir(
    souvenirid: &str
) -> Result<bool, String> {
    println!("test deleting souvenir {souvenirid}");
    use crate::schema::souvenirs::dsl::*;
    let conn = &mut establish_connection();

    match diesel::delete(souvenirs.filter(souvenir_id.eq(souvenirid))).execute(conn) {
        Ok(_) => Ok(true), // Successfully deleted
        Err(e) => Err(format!("Error deleting souvenir: {}", e)),
    }
}

#[tauri::command]
pub fn get_souvenirs_by_store(storeid: String) -> Result<Vec<Souvenir>, String> {
    println!("getting souvenirs for store {}", storeid);
    use crate::schema::souvenirs::dsl::*;
    let conn = &mut establish_connection();

    souvenirs
        .filter(store_id.eq(storeid))
        .load::<Souvenir>(conn)
        .map_err(|err| format!("Database error: {}", err))
}