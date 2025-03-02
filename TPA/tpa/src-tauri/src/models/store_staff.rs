use serde::{Serialize, Deserialize};
use crate::schema::store_staffs;
use diesel::prelude::*;

#[derive(Debug, Queryable, Insertable, AsChangeset, Serialize, Deserialize, Clone)]
#[diesel(table_name = store_staffs)]
pub struct StoreStaff{
    pub store_id: String,
    pub staff_id: String
}