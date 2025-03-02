use serde::{Serialize, Deserialize};
use crate::schema::ride_staffs;
use diesel::prelude::*;

#[derive(Debug, Queryable, Insertable, AsChangeset, Serialize, Deserialize, Clone)]
#[diesel(table_name = ride_staffs)]
pub struct RideStaff{
    pub ride_id: String,
    pub staff_id: String
}