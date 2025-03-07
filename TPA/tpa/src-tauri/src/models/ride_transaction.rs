use serde::{Serialize, Deserialize};
use crate::schema::ride_transactions;
use diesel::prelude::*;

#[derive(Debug, Queryable, Insertable, AsChangeset, Serialize, Deserialize, Clone)]
#[diesel(table_name = ride_transactions)]
pub struct RideTransaction{
    pub transaction_id: String,
    pub customer_id: String,
    pub ride_id: String,
    pub amount: i32,
}