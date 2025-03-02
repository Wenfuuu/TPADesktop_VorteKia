use uuid::Uuid;

use crate::models::store_removal_proposal::StoreRemovalProposal;
use crate::db::establish_connection;
use crate::diesel::prelude::*;

#[tauri::command]
pub fn propose_store_removal(
    storeid: &str,
    staffid: &str,
    removereason: &str,
) -> Result<bool, String> {
    println!("test proposing store removal for {storeid}");
    use crate::schema::store_removal_proposals::dsl::*;
    let conn = &mut establish_connection();

    let new_proposal = StoreRemovalProposal {
        proposal_id: format!("SRMV-{}", &Uuid::new_v4().to_string()[..8]),
        store_id: storeid.to_string(),
        staff_id: staffid.to_string(),
        reason: removereason.to_string(),
    };

    diesel::insert_into(store_removal_proposals)
        .values(&new_proposal)
        .execute(conn)
        .map(|_| true)
        .map_err(|err| format!("Database error: {}", err))
}