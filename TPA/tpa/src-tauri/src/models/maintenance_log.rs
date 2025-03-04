use serde::{Serialize, Deserialize};
use crate::schema::maintenance_logs;
use diesel::prelude::*;

#[derive(Debug, Queryable, Insertable, AsChangeset, Serialize, Deserialize, Clone)]
#[diesel(table_name = maintenance_logs)]
pub struct MaintenanceLog{
    pub log_id: String,
    pub staff_id: String,
    pub report_id: Option<String>,
    pub task_id: Option<String>,
    pub status: String,
}