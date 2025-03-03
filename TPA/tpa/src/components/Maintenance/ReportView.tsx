import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react"
import { toast } from "sonner";
import ReportList from "./ReportList";


export default function ReportView(){
    const [reports, setReports] = useState<Reports[]>([])
    const [staff, setStaff] = useState<Staff | null>(null);

    useEffect(() => {
      fetchReports();
      get_staff();
    }, []);

    const get_staff = async () => {
      const response = await invoke("get_current_staff");
      if (response !== null) {
        setStaff(response as Staff);
      }
    };

    const fetchReports = async () => {
      const reportData: Reports[] = await invoke("get_all_reports");

      setReports(reportData);
    };

    const handleAccept = (report: Reports, staff_id: string) => {
      invoke("accept_report", {
        reportid: report.report_id,
        rideid: report.ride_id,
      }).then((success) => {
        if (success) {
          toast("Request has been accepted!");
          fetchReports();
        }
      }).catch((e) => {
          console.log(e);
          toast("Failed to accept request!");
      });
    }

    const handleReject = (report: Reports) => {
        invoke("reject_report", {
            reportid: report.report_id
        }).then((success) => {
          if (success){
            toast("Request has been rejected!");
            fetchReports()
          }
        }).catch((e) =>{
            console.log(e);
            toast("Failed to reject request!");
        })
    }

    return (
      <div className="container mx-auto px-6">
        <ReportList
          reports={reports}
          onAccept={handleAccept}
          onReject={handleReject}
        />


      </div>
    );
}