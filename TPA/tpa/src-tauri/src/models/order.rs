use serde::{Serialize, Deserialize};
use crate::schema::orders;
use diesel::prelude::*;

#[derive(Debug, Queryable, Insertable, AsChangeset, Serialize, Deserialize, Clone)]
#[diesel(table_name = orders)]
pub struct Order{
    pub order_id: String,
    pub restaurant_id: String,
    pub menu_id: String,
    pub customer_id: String,
    pub assigned_to: Option<String>,
    pub status: String,
}