import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react"
import { toast } from "sonner";
import ReportList from "./ReportList";
import { useStaff } from "@/hooks/use-staff";

export default function ReportView(){
    const [reports, setReports] = useState<Reports[]>([])
    const staff = useStaff();

    useEffect(() => {
      if (staff) {
        fetchReports();
      }
    }, [staff]);

    const fetchReports = async () => {
      if (!staff) return;
      let reportData: Reports[];

      if (staff.role === "maintenance staff") {
        reportData = await invoke("get_assigned_reports", {
          staffid: staff.staff_id,
        });
      } else {
        reportData = await invoke("get_all_reports");
      }

      console.log(reportData)
      setReports(reportData);
    };

    const handleAccept = (report: Reports, staff_id: string) => {
      invoke("accept_report", {
        reportid: report.report_id,
        rideid: report.ride_id,
        staffid: staff_id
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

    const submitReport = (report: Reports) => {
        invoke("submit_report", {
            reportid: report.report_id,
            staffid: report.assigned_to
        }).then((success) => {
          if (success){
            toast("Report has been submitted!");
            fetchReports()
          }
        }).catch((e) =>{
            console.log(e);
            toast("Failed to submit report!");
        })
    }

    return (
      <div className="container mx-auto px-6">
        <ReportList
          reports={reports}
          onAccept={handleAccept}
          onReject={handleReject}
          onSubmit={submitReport}
        />
      </div>
    );
}