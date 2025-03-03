use serde::{Serialize, Deserialize};
use crate::schema::report_staffs;
use diesel::prelude::*;

#[derive(Debug, Queryable, Insertable, AsChangeset, Serialize, Deserialize, Clone)]
#[diesel(table_name = report_staffs)]
pub struct ReportStaff{
    pub report_id: String,
    pub staff_id: String
}