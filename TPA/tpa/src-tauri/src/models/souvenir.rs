use serde::{Serialize, Deserialize};
use crate::schema::souvenirs;
use diesel::prelude::*;

#[derive(Debug, Queryable, Insertable, AsChangeset, Serialize, Deserialize, Clone)]
#[diesel(table_name = souvenirs)]
pub struct Souvenir {
    pub souvenir_id: String,
    pub store_id: String,
    pub name: String,
    pub price: i32,
    pub image: Option<Vec<u8>>,
}