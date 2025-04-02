use crate::handler::maintenance_log_handler::add_task_log;
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

pub fn reassign_task(taskid: &str) ->  Result<bool, String> {// klo revisi
    println!("reassigning task {}", taskid);
    use crate::schema::tasks::dsl::*;
    let conn = &mut establish_connection();

    let update_query = diesel::update(tasks)
        .filter(task_id.eq(taskid))
        .set(status.eq("In Progress".to_string()));

    match update_query.execute(conn) {
        Ok(_) => Ok(true),
        Err(e) => Err(format!("Error reassigning task: {}", e)),
    }
}

pub fn complete_task(taskid: &str) ->  Result<bool, String> {
    println!("completing task {}", taskid);
    use crate::schema::tasks::dsl::*;
    let conn = &mut establish_connection();

    let update_query = diesel::update(tasks)
        .filter(task_id.eq(taskid))
        .set(status.eq("Completed".to_string()));

    match update_query.execute(conn) {
        Ok(_) => Ok(true),
        Err(e) => Err(format!("Error completing task: {}", e)),
    }
}

#[tauri::command]
pub fn submit_task(taskid: &str, staffid: &str) -> Result<bool, String>{
    println!("submitting task {}", taskid);
    use crate::schema::tasks::dsl::*;
    let conn = &mut establish_connection();

    let update_query = diesel::update(tasks)
        .filter(task_id.eq(taskid))
        .set(status.eq("Submitted".to_string()));

    //add to maintenance logs
    match add_task_log(taskid, staffid) {
        Ok(_) => (),
        Err(e) => return Err(format!("Error adding task log: {}", e)),
    }                                                  

    match update_query.execute(conn) {
        Ok(_) => Ok(true), // Successfully updated
        Err(e) => Err(format!("Error submitting task: {}", e)),
    }
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

    let starttime = NaiveDateTime::parse_from_str(new_start_time, "%Y-%m-%dT%H:%M:%S")
    .map_err(|e| format!("Invalid start time format: {}", e))?;
    let endtime = NaiveDateTime::parse_from_str(new_end_time, "%Y-%m-%dT%H:%M:%S")
    .map_err(|e| format!("Invalid end time format: {}", e))?;

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
pub fn get_assigned_tasks(staffid: &str) -> Result<Vec<TaskDTO>, String> {
    println!("getting all assigned tasks");
    use crate::schema::tasks::dsl::*;
    let conn = &mut establish_connection();

    match tasks.filter(assigned_to.eq(staffid))
    .load::<Task>(conn) {
        Ok(results) => {
            let dto_results: Vec<TaskDTO> = results.into_iter().map(|s| s.into()).collect();
            Ok(dto_results)
        }
        Err(e) => {
            eprintln!("Error fetching tasks: {}", e);
            Err(e.to_string())
        }
    }
}

#[tauri::command]
pub fn get_all_tasks() -> Result<Vec<TaskDTO>, String> {
    println!("getting all tasks");
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