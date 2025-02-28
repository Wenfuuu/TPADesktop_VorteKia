use serde::{Serialize, Deserialize};
use crate::schema::menus;
use diesel::prelude::*;

#[derive(Debug, Queryable, Insertable, AsChangeset, Serialize, Deserialize, Clone)]
#[diesel(table_name = menus)]
pub struct Menu {
    pub menu_id: String,
    pub restaurant_id: String,
    pub name: String,
    pub price: i32,
    pub image: Option<Vec<u8>>,
}