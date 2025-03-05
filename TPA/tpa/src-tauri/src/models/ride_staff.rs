use serde::{Serialize, Deserialize};
use crate::{models::{ride::Ride, staff::Staff}, schema::ride_staffs};
use diesel::prelude::*;

#[derive(Debug, Queryable, Insertable, AsChangeset, Serialize, Deserialize, Clone, Associations)]
#[diesel(table_name = ride_staffs)]
#[diesel(belongs_to(Ride, foreign_key = ride_id))]
#[diesel(belongs_to(Staff, foreign_key = staff_id))]
pub struct RideStaff{
    pub ride_id: String,
    pub staff_id: String
}