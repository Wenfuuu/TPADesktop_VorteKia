use serde::{Serialize, Deserialize};
use crate::schema::restaurant_staffs;
use diesel::prelude::*;

#[derive(Debug, Queryable, Insertable, AsChangeset, Serialize, Deserialize, Clone)]
#[diesel(table_name = restaurant_staffs)]
pub struct RestaurantStaff{
    pub restaurant_id: String,
    pub staff_id: String
}