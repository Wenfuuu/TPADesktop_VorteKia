use serde::{Serialize, Deserialize};
use crate::schema::broadcasts;
use diesel::prelude::*;

#[derive(Debug, Queryable, Insertable, AsChangeset, Serialize, Deserialize, Clone)]
#[diesel(table_name = broadcasts)]
pub struct Broadcast{
    pub broadcast_id: String,
    pub message: String,
    pub customer_id: Option<String>,
}