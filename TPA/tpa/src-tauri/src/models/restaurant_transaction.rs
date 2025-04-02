use serde::{Serialize, Deserialize};
use crate::schema::restaurant_transactions;
use diesel::prelude::*;

#[derive(Debug, Queryable, Insertable, AsChangeset, Serialize, Deserialize, Clone)]
#[diesel(table_name = restaurant_transactions)]
pub struct RestaurantTransaction{
    pub transaction_id: String,
    pub customer_id: String,
    pub restaurant_id: String,
    pub menu_id: String,
    pub quantity: i32,
    pub total: i32,
}