use uuid::Uuid;

use crate::models::new_restaurant_proposal::NewRestaurantProposal;
use crate::models::new_ride_proposal::NewRideProposal;
use crate::models::new_store_proposal::NewStoreProposal;
use crate::models::ride_removal_proposal::RideRemovalProposal;
use crate::db::establish_connection;
use crate::diesel::prelude::*;
use crate::models::store_removal_proposal::StoreRemovalProposal;

#[tauri::command]
pub fn accept_new_restaurant_proposal(
    proposalid: &str,
) -> Result<bool, String> {
    println!("test accepting new restaurant proposal with id {}", proposalid);
    use crate::schema::new_restaurant_proposals::dsl::*;
    let conn = &mut establish_connection();

    diesel::update(new_restaurant_proposals.filter(proposal_id.eq(proposalid)))
        .set(status.eq("Accepted"))
        .execute(conn)
        .map(|_| true)
        .map_err(|err| format!("Database error: {}", err))
}

#[tauri::command]
pub fn reject_new_restaurant_proposal(
    proposalid: &str,
) -> Result<bool, String> {
    println!("test rejecting new restaurant proposal with id {}", proposalid);
    use crate::schema::new_restaurant_proposals::dsl::*;
    let conn = &mut establish_connection();

    diesel::update(new_restaurant_proposals.filter(proposal_id.eq(proposalid)))
        .set(status.eq("Rejected"))
        .execute(conn)
        .map(|_| true)
        .map_err(|err| format!("Database error: {}", err))
}

#[tauri::command]
pub fn accept_new_ride_proposal(
    proposalid: &str,
) -> Result<bool, String> {
    println!("test accepting new ride proposal with id {}", proposalid);
    use crate::schema::new_ride_proposals::dsl::*;
    let conn = &mut establish_connection();

    diesel::update(new_ride_proposals.filter(proposal_id.eq(proposalid)))
        .set(status.eq("Accepted"))
        .execute(conn)
        .map(|_| true)
        .map_err(|err| format!("Database error: {}", err))
}

#[tauri::command]
pub fn reject_new_ride_proposal(
    proposalid: &str,
) -> Result<bool, String> {
    println!("test rejecting new ride proposal with id {}", proposalid);
    use crate::schema::new_ride_proposals::dsl::*;
    let conn = &mut establish_connection();

    diesel::update(new_ride_proposals.filter(proposal_id.eq(proposalid)))
        .set(status.eq("Rejected"))
        .execute(conn)
        .map(|_| true)
        .map_err(|err| format!("Database error: {}", err))
}

#[tauri::command]
pub fn accept_ride_removal_proposal(
    proposalid: &str,
) -> Result<bool, String> {
    println!("test accepting ride removal proposal with id {}", proposalid);
    use crate::schema::ride_removal_proposals::dsl::*;
    let conn = &mut establish_connection();

    diesel::update(ride_removal_proposals.filter(proposal_id.eq(proposalid)))
        .set(status.eq("Accepted"))
        .execute(conn)
        .map(|_| true)
        .map_err(|err| format!("Database error: {}", err))
}

#[tauri::command]
pub fn reject_ride_removal_proposal(
    proposalid: &str,
) -> Result<bool, String> {
    println!("test rejecting ride removal proposal with id {}", proposalid);
    use crate::schema::ride_removal_proposals::dsl::*;
    let conn = &mut establish_connection();

    diesel::update(ride_removal_proposals.filter(proposal_id.eq(proposalid)))
        .set(status.eq("Rejected"))
        .execute(conn)
        .map(|_| true)
        .map_err(|err| format!("Database error: {}", err))
}

#[tauri::command]
pub fn accept_new_store_proposal(
    proposalid: &str,
) -> Result<bool, String> {
    println!("Accepting new store proposal with id {}", proposalid);
    use crate::schema::new_store_proposals::dsl::*;
    let conn = &mut establish_connection();

    diesel::update(new_store_proposals.filter(proposal_id.eq(proposalid)))
        .set(status.eq("Accepted"))
        .execute(conn)
        .map(|_| true)
        .map_err(|err| format!("Database error: {}", err))
}

#[tauri::command]
pub fn reject_new_store_proposal(
    proposalid: &str,
) -> Result<bool, String> {
    println!("Rejecting new store proposal with id {}", proposalid);
    use crate::schema::new_store_proposals::dsl::*;
    let conn = &mut establish_connection();

    diesel::update(new_store_proposals.filter(proposal_id.eq(proposalid)))
        .set(status.eq("Rejected"))
        .execute(conn)
        .map(|_| true)
        .map_err(|err| format!("Database error: {}", err))
}

#[tauri::command]
pub fn accept_store_removal_proposal(
    proposalid: &str,
) -> Result<bool, String> {
    println!("Accepting store removal proposal with id {}", proposalid);
    use crate::schema::store_removal_proposals::dsl::*;
    let conn = &mut establish_connection();

    diesel::update(store_removal_proposals.filter(proposal_id.eq(proposalid)))
        .set(status.eq("Accepted"))
        .execute(conn)
        .map(|_| true)
        .map_err(|err| format!("Database error: {}", err))
}

#[tauri::command]
pub fn reject_store_removal_proposal(
    proposalid: &str,
) -> Result<bool, String> {
    println!("Rejecting store removal proposal with id {}", proposalid);
    use crate::schema::store_removal_proposals::dsl::*;
    let conn = &mut establish_connection();

    diesel::update(store_removal_proposals.filter(proposal_id.eq(proposalid)))
        .set(status.eq("Rejected"))
        .execute(conn)
        .map(|_| true)
        .map_err(|err| format!("Database error: {}", err))
}

#[tauri::command]
pub fn get_all_ride_removal_proposals() -> Result<Vec<RideRemovalProposal>, String> {
    println!("test getting all ride removal proposals");
    use crate::schema::ride_removal_proposals::dsl::*;
    let conn = &mut establish_connection();

    ride_removal_proposals
        .load::<RideRemovalProposal>(conn)
        .map_err(|err| format!("Database error: {}", err))
}

#[tauri::command]
pub fn get_all_new_ride_proposals() -> Result<Vec<NewRideProposal>, String> {
    println!("test getting all ride proposals");
    use crate::schema::new_ride_proposals::dsl::*;
    let conn = &mut establish_connection();

    new_ride_proposals
        .load::<NewRideProposal>(conn)
        .map_err(|err| format!("Database error: {}", err))
}

#[tauri::command]
pub fn get_all_new_restaurant_proposals() -> Result<Vec<NewRestaurantProposal>, String> {
    println!("test getting all restaurant proposals");
    use crate::schema::new_restaurant_proposals::dsl::*;
    let conn = &mut establish_connection();

    new_restaurant_proposals
        .load::<NewRestaurantProposal>(conn)
        .map_err(|err| format!("Database error: {}", err))
}

#[tauri::command]
pub fn get_all_store_removal_proposals() -> Result<Vec<StoreRemovalProposal>, String> {
    println!("test getting all store removal proposals");
    use crate::schema::store_removal_proposals::dsl::*;
    let conn = &mut establish_connection();

    store_removal_proposals
        .load::<StoreRemovalProposal>(conn)
        .map_err(|err| format!("Database error: {}", err))
}

#[tauri::command]
pub fn get_all_new_store_proposals() -> Result<Vec<NewStoreProposal>, String> {
    println!("test getting all store proposals");
    use crate::schema::new_store_proposals::dsl::*;
    let conn = &mut establish_connection();

    new_store_proposals
        .load::<NewStoreProposal>(conn)
        .map_err(|err| format!("Database error: {}", err))
}

#[tauri::command]
pub fn propose_new_ride(
    staffid: &str,
    ridename: &str,
    desc: &str,
    newimagedata: Vec<u8>,
)-> Result<bool, String> {
    println!("test proposing new ride with desc {}", desc);
    use crate::schema::new_ride_proposals::dsl::*;
    let conn = &mut establish_connection();

    let new_proposal = NewRideProposal {
        proposal_id: format!("RNEW-{}", &Uuid::new_v4().to_string()[..8]),
        staff_id: staffid.to_string(),
        ride_name: ridename.to_string(),
        description: desc.to_string(),
        status: "Pending".to_string(),
        image: newimagedata
    };

    diesel::insert_into(new_ride_proposals)
        .values(&new_proposal)
        .execute(conn)
        .map(|_| true)
        .map_err(|err| format!("Database error: {}", err))
}

#[tauri::command]
pub fn propose_ride_removal(
    rideid: &str,
    staffid: &str,
    removereason: &str,
) -> Result<bool, String> {
    println!("test proposing ride removal for {rideid}");
    use crate::schema::ride_removal_proposals::dsl::*;
    let conn = &mut establish_connection();

    let new_proposal = RideRemovalProposal {
        proposal_id: format!("RRMV-{}", &Uuid::new_v4().to_string()[..8]),
        ride_id: rideid.to_string(),
        staff_id: staffid.to_string(),
        reason: removereason.to_string(),
        status: "Pending".to_string(),
    };

    diesel::insert_into(ride_removal_proposals)
        .values(&new_proposal)
        .execute(conn)
        .map(|_| true)
        .map_err(|err| format!("Database error: {}", err))
}

#[tauri::command]
pub fn propose_new_restaurant(
    staffid: &str,
    restaurantname: &str,
    desc: &str,
    newimagedata: Vec<u8>,
)-> Result<bool, String> {
    println!("test proposing new store with desc {}", desc);
    use crate::schema::new_restaurant_proposals::dsl::*;
    let conn = &mut establish_connection();

    let new_proposal = NewRestaurantProposal {
        proposal_id: format!("RSTNEW-{}", &Uuid::new_v4().to_string()[..8]),
        staff_id: staffid.to_string(),
        restaurant_name: restaurantname.to_string(),
        description: desc.to_string(),
        status: "Pending".to_string(),
        image: newimagedata
    };

    diesel::insert_into(new_restaurant_proposals)
        .values(&new_proposal)
        .execute(conn)
        .map(|_| true)
        .map_err(|err| format!("Database error: {}", err))
}

#[tauri::command]
pub fn propose_new_store(
    staffid: &str,
    storename: &str,
    desc: &str,
    newimagedata: Vec<u8>,
)-> Result<bool, String> {
    println!("test proposing new store with desc {}", desc);
    use crate::schema::new_store_proposals::dsl::*;
    let conn = &mut establish_connection();

    let new_proposal = NewStoreProposal {
        proposal_id: format!("STRNEW-{}", &Uuid::new_v4().to_string()[..8]),
        staff_id: staffid.to_string(),
        store_name: storename.to_string(),
        description: desc.to_string(),
        status: "Pending".to_string(),
        image: newimagedata
    };

    diesel::insert_into(new_store_proposals)
        .values(&new_proposal)
        .execute(conn)
        .map(|_| true)
        .map_err(|err| format!("Database error: {}", err))
}

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
        status: "Pending".to_string(),
    };

    diesel::insert_into(store_removal_proposals)
        .values(&new_proposal)
        .execute(conn)
        .map(|_| true)
        .map_err(|err| format!("Database error: {}", err))
}