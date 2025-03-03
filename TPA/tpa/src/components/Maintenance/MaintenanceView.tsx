import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react"
import MaintenanceList from "./MaintenanceList";
import { toast } from "sonner";


export default function MaintenanceView(){
    const [maintenances, setMaintenances] = useState<Maintenance[]>([])
    const [staff, setStaff] = useState<Staff | null>(null);

    useEffect(() => {
      fetchMaintenances();
      get_staff();
    }, []);

    const get_staff = async () => {
      const response = await invoke("get_current_staff");
      if (response !== null) {
        setStaff(response as Staff);
      }
    };

    const fetchMaintenances = async () => {
      const maintenanceData: Maintenance[] = await invoke("get_all_maintenances");

      setMaintenances(maintenanceData)
    };

    const handleAccept = (maintenance: Maintenance) => {
        invoke("accept_maintenance", {
            maintenanceid: maintenance.maintenance_id,
            rideid: maintenance.ride_id
        }).then((success) => {
          if (success){
            toast("Request has been accepted!");
            fetchMaintenances()
          }
        }).catch((e) =>{
            console.log(e);
            toast("Failed to accept request!");
        })
    }

    const handleReject = (maintenance: Maintenance) => {
        invoke("reject_maintenance", {
            maintenanceid: maintenance.maintenance_id
        }).then((success) => {
          if (success){
            toast("Request has been rejected!");
            fetchMaintenances()
          }
        }).catch((e) =>{
            console.log(e);
            toast("Failed to reject request!");
        })
    }

    return (
      <div className="container mx-auto px-6">
        <MaintenanceList
          maintenances={maintenances}
          onAccept={handleAccept}
          onReject={handleReject}
        />


      </div>
    );
}