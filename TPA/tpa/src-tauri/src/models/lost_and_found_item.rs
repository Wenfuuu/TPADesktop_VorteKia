use serde::{Serialize, Deserialize};
use crate::schema::lostandfounditems;
use diesel::prelude::*;

#[derive(Debug, Queryable, Insertable, AsChangeset, Serialize, Deserialize, Clone)]
#[diesel(table_name = lostandfounditems)]
pub struct LostAndFound{
    pub item_id: String,
    pub name: String,
    pub item_type: String,
    pub color: String,
    pub last_seen_location: String,
    pub found_location: Option<String>,
    pub owner: String,
    pub finder: Option<String>,
    pub status: String,
    pub image: Option<Vec<u8>>
}