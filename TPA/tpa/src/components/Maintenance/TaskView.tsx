import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import TaskList from "./TaskList";
import { toast } from "sonner";


export default function TaskView(){
    const [tasks, setTasks] = useState<Task[]>([]);
    const [staff, setStaff] = useState<Staff | null>(null);

    useEffect(() => {
      get_staff();
    }, []);

    useEffect(() => {
      if (staff) {
        fetchTasks();
      }
    }, [staff]);

    const get_staff = async () => {
      const response = await invoke("get_current_staff");
      if (response !== null) {
        setStaff(response as Staff);
      }
    };

    const fetchTasks = async () => {
        if(!staff) return;
        let taskData: Task[]

        if (staff.role === "maintenance staff") {
          taskData = await invoke("get_assigned_tasks", {
            staffid: staff.staff_id,
          });
        } else {
          taskData = await invoke("get_all_tasks");
        }

        setTasks(taskData)
    };

    const addTask = (newTask: Omit<Task, "task_id">) => {
        invoke("create_task", {
            rideid: newTask.ride_id,
            staffid: newTask.assigned_to,
            newStartTime: newTask.start_time+":00",
            newEndTime: newTask.end_time+":00"
        }).then((success) =>{
            if(success){
                toast("New task has been created!")
                fetchTasks()
            }
        }).catch((e) =>{
            console.log(e);
            toast(e);
        })
    }

    const updateTask = (updatedTask: Task) => {
        console.log(updatedTask)
        invoke("update_task_schedule", {
            id: updatedTask.task_id,
            newStartTime: updatedTask.start_time+":00",
            newEndTime: updatedTask.end_time+":00"
        }).then((success) =>{
            if(success){
                toast("Task has been rescheduled!")
                fetchTasks()
            }
        }).catch((e) =>{
            console.log(e);
            toast(e);
        })
    }

    const submitTask = (task: Task) => {
        invoke("submit_task", {
            taskid: task.task_id
        }).then((success) => {
          if (success){
            toast("Task has been submitted!");
            fetchTasks()
          }
        }).catch((e) =>{
            console.log(e);
            toast("Failed to submit task!");
        })
    }

    return(
        <div className="container mx-auto px-6 text-white">
            <TaskList
            tasks={tasks}
            onAdd={addTask}
            onUpdate={updateTask}
            onSubmit={submitTask}
            />
        </div>
    )
}