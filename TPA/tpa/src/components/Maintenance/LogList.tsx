import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Check, Edit } from "lucide-react";
import { invoke } from "@tauri-apps/api/core";
import { useStaff } from "@/hooks/use-staff";

type MaintenanceLog = {
  log_id: string;
  staff_id: string;
  report_id: string | null;
  task_id: string | null;
  status: string;
};

type Props = {
  logs: MaintenanceLog[];
  onApprove: (log: MaintenanceLog) => void;
  onRevise: (log: MaintenanceLog) => void;
};

export default function LogList({ logs, onApprove, onRevise }: Props) {
  const [allStaff, setAllStaff] = useState<Staff[]>([]);
  const currentStaff = useStaff();

  useEffect(() => {
    fetchStaff();
  }, []);

  async function fetchStaff() {
    try {
      const fetchedStaff: Staff[] = await invoke("get_all_staffs");
      setAllStaff(fetchedStaff);
    } catch (error) {
      console.error("Failed to fetch staff:", error);
    }
  }

  // Helper function to get staff name by ID
  const getStaffNameById = (staffId: string): string => {
    const staff = allStaff.find((s) => s.staff_id === staffId);
    return staff ? staff.name : "Unknown Staff";
  };

  return (
    <>
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6 max-w-6xl mx-auto">
        <div className="mb-6 text-black">
          <h2 className="text-2xl font-bold">Maintenance Logs</h2>
        </div>

        {logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <p className="text-gray-500 mb-2">No maintenance logs available.</p>
            <p className="text-sm text-gray-400">
              Logs will appear after maintenance tasks are completed
            </p>
          </div>
        ) : (
          <ul className="space-y-6">
            {logs.map((log) => (
              <li
                key={log.log_id}
                className="p-5 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 flex gap-4 flex-col bg-gray-50"
              >
                <div className="flex justify-between items-center gap-6">
                  <div className="flex-1">
                    <p className="font-semibold text-lg text-black">
                      Log ID: {log.log_id}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">Staff:</span>{" "}
                      {getStaffNameById(log.staff_id)}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">Associated Report:</span>{" "}
                      {log.report_id || "N/A"}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">Associated Task:</span>{" "}
                      {log.task_id || "N/A"}
                    </p>
                    <p
                      className={`text-white rounded-full px-3 py-1 mt-2 text-xs font-medium inline-block ${
                        log.status === "Approved"
                          ? "bg-green-500"
                          : log.status === "On Review"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                    >
                      {log.status}
                    </p>
                  </div>

                  {(currentStaff?.role === "maintenance manager" ||
                    currentStaff?.role === "ceo" ||
                    currentStaff?.role === "coo"
                  ) && (
                    <div className="flex flex-col gap-2">
                      <Button
                        className="bg-green-600 hover:bg-green-700 text-white cursor-pointer flex justify-around"
                        onClick={() => onApprove(log)}
                        disabled={log.status !== "On Review"}
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        className="bg-red-600 hover:bg-red-700 text-white cursor-pointer flex justify-around"
                        onClick={() => onRevise(log)}
                        disabled={log.status !== "On Review"}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Revise
                      </Button>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
