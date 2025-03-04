import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react"
import LogList from "./LogList";
import { toast } from "sonner";


export default function LogView(){
    const [logs, setLogs] = useState<MaintenanceLog[]>([]);
    const [staff, setStaff] = useState<Staff | null>(null);

    useEffect(() => {
      get_staff();
    }, []);

    useEffect(() => {
      if (staff) {
        fetchLogs();
      }
    }, [staff]);

    const get_staff = async () => {
      const response = await invoke("get_current_staff");
      if (response !== null) {
        setStaff(response as Staff);
      }
    };

    const fetchLogs = async () => {
        const logData: MaintenanceLog[] = await invoke("get_all_logs")

        setLogs(logData)
    }

    const approveLog = (log: MaintenanceLog) => {
        if(log.task_id){
            invoke("approve_task_log", {
                logid: log.log_id,
                taskid: log.task_id
            })
            .then((success) => {
                if(success){
                    toast("Approving Task log!");
                    fetchLogs()
                }
            }).catch((e) =>{
                console.log(e);
                toast("Failed to approve log!");
            })
        }
        else if(log.report_id){
            invoke("approve_report_log", { 
                logid: log.log_id,
                reportid: log.report_id
            })
            .then((success) => {
                if(success){
                    toast("Approving Report log!");
                    fetchLogs()
                }
            }).catch((e) =>{
                console.log(e);
                toast("Failed to approve log!");
            })
        }
    }

    const reviseLog = (log: MaintenanceLog) => {
        if(log.task_id){
            invoke("revise_task_log", {
                logid: log.log_id,
                taskid: log.task_id
            })
            .then((success) => {
                if(success){
                    toast("Revising Task log!");
                    fetchLogs()
                }
            }).catch((e) =>{
                console.log(e);
                toast("Failed to revise log!");
            })
        }
        else if(log.report_id){
            invoke("revise_report_log", { 
                logid: log.log_id,
                reportid: log.report_id
            })
            .then((success) => {
                if(success){
                    toast("Revising Report log!");
                    fetchLogs()
                }
            }).catch((e) =>{
                console.log(e);
                toast("Failed to revise log!");
            })
        }
    }

    return(
        <div className="container mx-auto px-6 text-white">
            <LogList
            logs={logs}
            onApprove={approveLog}
            onRevise={reviseLog}/>    
        </div>
    )
}