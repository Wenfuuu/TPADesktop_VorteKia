use serde::{Serialize, Deserialize};
use crate::schema::ride_queues;
use diesel::prelude::*;

#[derive(Debug, Queryable, Insertable, AsChangeset, Serialize, Deserialize, Clone)]
#[diesel(table_name = ride_queues)]
pub struct RideQueue {
    pub queue_id: String,
    pub ride_id: String,
    pub customer_id: String,
    pub position: i32,
}