use serde::{Serialize, Deserialize};
use crate::schema::maintenances;
use diesel::prelude::*;

#[derive(Debug, Queryable, Insertable, AsChangeset, Serialize, Deserialize, Clone)]
#[diesel(table_name = maintenances)]
pub struct Maintenance{
    pub maintenance_id: String,
    pub ride_id: String,
    pub staff_id: String,
    pub reason: String,
}