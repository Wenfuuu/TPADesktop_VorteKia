use serde::{Serialize, Deserialize};
use crate::schema::new_store_proposals;
use diesel::prelude::*;

#[derive(Debug, Queryable, Insertable, AsChangeset, Serialize, Deserialize, Clone)]
#[diesel(table_name = new_store_proposals)]
pub struct NewStoreProposal{
    pub proposal_id: String,
    pub staff_id: String,
    pub store_name: String,
    pub description: String,
    pub status: String,
    pub image: Vec<u8>,
}