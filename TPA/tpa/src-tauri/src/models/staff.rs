use serde::{Serialize, Deserialize};
use crate::schema::staffs;
use diesel::prelude::*;

#[derive(Debug, Queryable, Insertable, AsChangeset, Serialize, Deserialize, Clone)]
#[diesel(table_name = staffs)]
pub struct Staff{
    pub staff_id: String,
    pub name: String,
    pub password: String,
    pub role: String,
}