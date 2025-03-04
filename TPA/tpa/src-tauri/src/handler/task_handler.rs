use crate::models::task::{Task, TaskDTO};
use crate::db::establish_connection;
use crate::diesel::prelude::*;
use chrono::NaiveDateTime;
use uuid::Uuid;

#[tauri::command]
pub fn create_task(
    rideid: &str,
    staffid: &str,
    new_start_time: &str,
    new_end_time: &str
) -> Result<bool, String>{
    use crate::schema::tasks::dsl::*;
    let conn = &mut establish_connection();

    let starttime = NaiveDateTime::parse_from_str(new_start_time, "%Y-%m-%dT%H:%M:%S")
    .map_err(|e| format!("Invalid start time format: {}", e))?;
    let endtime = NaiveDateTime::parse_from_str(new_end_time, "%Y-%m-%dT%H:%M:%S")
    .map_err(|e| format!("Invalid end time format: {}", e))?;

    let new_task = Task {
        task_id: format!("TASK-{}", &Uuid::new_v4().to_string()[..8]),
        ride_id: rideid.to_string(),
        assigned_to: staffid.to_string(),
        start_time: starttime,
        end_time: endtime,
        status: "In Progress".to_string()
    };

    diesel::insert_into(tasks)
        .values(&new_task)
        .execute(conn)
        .map(|_| true)
        .map_err(|err| format!("Database error: {}", err))
}

#[tauri::command]
pub fn update_task_schedule(
    id: &str,
    new_start_time: &str,
    new_end_time: &str,
) -> Result<bool, String> {
    println!("Updating tasks {id}");
    use crate::schema::tasks::dsl::*;
    let conn = &mut establish_connection();

    let starttime = NaiveDateTime::parse_from_str(new_start_time, "%Y-%m-%d %H:%M:%S")
    .map_err(|e| format!("Invalid start time format: {}", e))?;
    let endtime = NaiveDateTime::parse_from_str(new_end_time, "%Y-%m-%d %H:%M:%S")
    .map_err(|e| format!("Invalid start time format: {}", e))?;

    //update query
    let update_query = diesel::update(tasks)
        .filter(task_id.eq(id))
        .set((
            start_time.eq(starttime),
            end_time.eq(endtime),
        ));

    match update_query.execute(conn) {
        Ok(_) => Ok(true),
        Err(e) => Err(format!("Error updating task: {}", e)),
    }
}

#[tauri::command]
pub fn get_all_tasks() -> Result<Vec<TaskDTO>, String> {
    println!("Fetching all tasks");
    use crate::schema::tasks::dsl::*;
    let conn = &mut establish_connection();

    match tasks.load::<Task>(conn) {
        Ok(results) => {
            let dto_results: Vec<TaskDTO> = results.into_iter().map(|s| s.into()).collect();
            Ok(dto_results)
        }
        Err(e) => {
            eprintln!("Error fetching stores: {}", e);
            Err(e.to_string())
        }
    }
}