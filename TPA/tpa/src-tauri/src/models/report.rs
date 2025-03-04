use serde::{Serialize, Deserialize};
use crate::schema::reports;
use diesel::prelude::*;

#[derive(Debug, Queryable, Insertable, AsChangeset, Serialize, Deserialize, Clone)]
#[diesel(table_name = reports)]
pub struct Report{
    pub report_id: String,
    pub ride_id: String,
    pub reported_by: String,
    pub assigned_to: Option<String>,
    pub reason: String,
    pub status: String,
}