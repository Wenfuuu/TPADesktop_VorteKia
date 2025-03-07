use serde::{Serialize, Deserialize};
use crate::schema::new_restaurant_proposals;
use diesel::prelude::*;

#[derive(Debug, Queryable, Insertable, AsChangeset, Serialize, Deserialize, Clone)]
#[diesel(table_name = new_restaurant_proposals)]
pub struct NewRestaurantProposal{
    pub proposal_id: String,
    pub staff_id: String,
    pub restaurant_name: String,
    pub description: String,
    pub status: String,
    pub image: Vec<u8>,
}