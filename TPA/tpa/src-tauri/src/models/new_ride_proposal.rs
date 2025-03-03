use serde::{Serialize, Deserialize};
use crate::schema::new_ride_proposals;
use diesel::prelude::*;

#[derive(Debug, Queryable, Insertable, AsChangeset, Serialize, Deserialize, Clone)]
#[diesel(table_name = new_ride_proposals)]
pub struct NewRideProposal{
    pub proposal_id: String,
    pub staff_id: String,
    pub ride_name: String,
    pub description: String,
    pub image: Option<Vec<u8>>,
}