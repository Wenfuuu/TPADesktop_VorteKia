use serde::{Serialize, Deserialize};
use crate::schema::store_removal_proposals;
use diesel::prelude::*;

#[derive(Debug, Queryable, Insertable, AsChangeset, Serialize, Deserialize, Clone)]
#[diesel(table_name = store_removal_proposals)]
pub struct StoreRemovalProposal{
    pub proposal_id: String,
    pub store_id: String,
    pub staff_id: String,
    pub reason: String,
}