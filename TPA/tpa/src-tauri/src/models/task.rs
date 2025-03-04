use chrono::NaiveDateTime;
use serde::{Serialize, Deserialize};
use crate::schema::tasks;
use diesel::prelude::*;

#[derive(Debug, Queryable, Insertable, AsChangeset, Clone)]
#[diesel(table_name = tasks)]
pub struct Task{
    pub task_id: String,
    pub ride_id: String,
    pub assigned_to: String,
    pub start_time: NaiveDateTime,
    pub end_time: NaiveDateTime,
    pub status: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct TaskDTO{
    pub task_id: String,
    pub ride_id: String,
    pub assigned_to: String,
    pub start_time: String,
    pub end_time: String,
    pub status: String,
}

impl From<Task> for TaskDTO {
    fn from(task: Task) -> Self {
        Self {
            task_id: task.task_id,
            ride_id: task.ride_id,
            assigned_to: task.assigned_to,
            start_time: task.start_time.format("%Y-%m-%d %H:%M:%S").to_string(),
            end_time: task.end_time.format("%Y-%m-%d %H:%M:%S").to_string(),
            status: task.status,
        }
    }
}

impl From<TaskDTO> for Task {
    fn from(dto: TaskDTO) -> Self {
        Self {
            task_id: dto.task_id,
            ride_id: dto.ride_id,
            assigned_to: dto.assigned_to,
            start_time: NaiveDateTime::parse_from_str(&dto.start_time, "%Y-%m-%d %H:%M:%S")
                .expect("Invalid datetime format"),
            end_time: NaiveDateTime::parse_from_str(&dto.end_time, "%Y-%m-%d %H:%M:%S")
                .expect("Invalid datetime format"),
            status: dto.status,
        }
    }
}