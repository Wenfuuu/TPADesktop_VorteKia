use serde::{Serialize, Deserialize};
use crate::schema::store_transactions;
use diesel::prelude::*;

#[derive(Debug, Queryable, Insertable, AsChangeset, Serialize, Deserialize, Clone)]
#[diesel(table_name = store_transactions)]
pub struct StoreTransaction{
    pub transaction_id: String,
    pub customer_id: String,
    pub store_id: String,
    pub souvenir_id: String,
    pub quantity: i32,
    pub total: i32,
}