use serde::{Serialize, Deserialize};
use crate::schema::ride_removal_proposals;
use diesel::prelude::*;

#[derive(Debug, Queryable, Insertable, AsChangeset, Serialize, Deserialize, Clone)]
#[diesel(table_name = ride_removal_proposals)]
pub struct RideRemovalProposal{
    pub proposal_id: String,
    pub ride_id: String,
    pub staff_id: String,
    pub reason: String,
    pub status: String
}