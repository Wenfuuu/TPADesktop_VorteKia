use uuid::Uuid;

use crate::models::ride_queue::RideQueue;
use crate::db::establish_connection;
use crate::diesel::prelude::*;
use diesel::dsl::*;

#[tauri::command]
pub fn add_queue(rideid: String, customerid: String) -> Result<bool, String> {
    use crate::schema::ride_queues::dsl::*;
    let conn = &mut establish_connection();

    let next_position = ride_queues
        .filter(ride_id.eq(&rideid))
        .select(max(position))
        .first::<Option<i32>>(conn)
        .unwrap_or(Some(0))
        .unwrap_or(0) + 1;

    let new_queue = RideQueue {
        queue_id: format!("QUEUE-{}", &Uuid::new_v4().to_string()[..8]),
        ride_id: rideid.to_string(),
        customer_id: customerid.to_string(),
        position: next_position
    };

    diesel::insert_into(ride_queues)
        .values(&new_queue)
        .execute(conn)
        .map(|_| true)
        .map_err(|err| format!("Database error: {}", err))
}

#[tauri::command]
pub fn update_queue(rideid: String, customerid: String, newpos: i32) -> Result<bool, String> {
    use crate::schema::ride_queues::dsl::*;
    let conn = &mut establish_connection();

    // Get the current position of the customer
    let current_pos: Option<i32> = ride_queues
        .filter(ride_id.eq(&rideid))
        .filter(customer_id.eq(&customerid))
        .select(position)
        .first(conn)
        .optional()
        .map_err(|err| format!("Database error: {}", err))?;
    
    // Get the count of customers in the queue
    let queue_count: i64 = ride_queues
        .filter(ride_id.eq(&rideid))
        .count()
        .get_result(conn)
        .map_err(|err| format!("Database error: {}", err))?;
    let queue_count = queue_count as i32;
    
    if let Some(oldpos) = current_pos {
        // Ensure newpos does not exceed the maximum position (queue count)
        let newpos = newpos.min(queue_count);
        
        if oldpos < newpos {
            // Shift forward: Move all positions between oldpos and newpos
            diesel::update(ride_queues)
                .filter(ride_id.eq(&rideid))
                .filter(position.gt(oldpos).and(position.le(newpos)))
                .set(position.eq(position - 1))
                .execute(conn)
                .map_err(|err| format!("Database error: {}", err))?;
        } else if oldpos > newpos {
            // Shift backward: Move all positions between newpos and oldpos
            diesel::update(ride_queues)
                .filter(ride_id.eq(&rideid))
                .filter(position.ge(newpos).and(position.lt(oldpos)))
                .set(position.eq(position + 1))
                .execute(conn)
                .map_err(|err| format!("Database error: {}", err))?;
        }

        // Update the customer's position
        diesel::update(ride_queues)
            .filter(ride_id.eq(&rideid))
            .filter(customer_id.eq(&customerid))
            .set(position.eq(newpos))
            .execute(conn)
            .map_err(|err| format!("Database error: {}", err))?;
    }

    Ok(true)
}

#[tauri::command]
pub fn remove_queue(rideid: String, customerid: String) -> Result<bool, String> {
    use crate::schema::ride_queues::dsl::*;
    let conn = &mut establish_connection();

    // Get the current position of the customer in the queue
    let removed_position: i32 = ride_queues
        .filter(ride_id.eq(&rideid))
        .filter(customer_id.eq(&customerid))
        .select(position)
        .first::<i32>(conn)
        .map_err(|_| "Customer not found in the queue".to_string())?;

    // Delete the customer from the queue
    diesel::delete(ride_queues)
        .filter(ride_id.eq(&rideid))
        .filter(customer_id.eq(&customerid))
        .execute(conn)
        .map(|_| true)
        .map_err(|err| format!("Database error: {}", err))?;

    // Shift positions of remaining customers (move forward -1)
    diesel::update(ride_queues)
        .filter(ride_id.eq(&rideid))
        .filter(position.gt(removed_position)) // Only shift those after the removed position
        .set(position.eq(position - 1))
        .execute(conn)
        .map(|_| true)
        .map_err(|err| format!("Database error: {}", err))
}

#[tauri::command]
pub fn get_ride_queue(rideid: &str) -> Result<Vec<RideQueue>, String> {
    println!("getting all queue {}", rideid);
    use crate::schema::ride_queues::dsl::*;
    let conn = &mut establish_connection();

    ride_queues
        .filter(ride_id.eq(rideid))
        .order(position.asc())
        .load::<RideQueue>(conn)
        .map_err(|err| format!("Database error: {}", err))
}