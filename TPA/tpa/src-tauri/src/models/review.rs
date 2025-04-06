use serde::{Serialize, Deserialize};
use crate::schema::reviews;
use diesel::prelude::*;

#[derive(Debug, Queryable, Insertable, AsChangeset, Serialize, Deserialize, Clone)]
#[diesel(table_name = reviews)]
pub struct Review{
    pub review_id: String,
    pub customer_id: String,
    pub place_id: String,
    pub review: String   
}