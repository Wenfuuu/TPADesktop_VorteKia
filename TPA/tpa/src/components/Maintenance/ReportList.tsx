import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { CheckCircle, XCircle, Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";
import { invoke } from "@tauri-apps/api/core";

type Props = {
  reports: Reports[];
  onAccept: (report: Reports, assignedStaffId: string) => void;
  onReject: (report: Reports) => void;
  onSubmit?: (report: Reports) => void;
};

export default function ReportList({
  reports,
  onAccept,
  onReject,
  onSubmit,
}: Props) {
  const [allStaff, setAllStaff] = useState<Staff[]>([]);
  const [allRides, setAllRides] = useState<{ ride_id: string; name: string }[]>(
    []
  );
  const [errors, setErrors] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Reports | null>(null);
  const [selectedStaffId, setSelectedStaffId] = useState("");
  const [currentStaff, setCurrentStaff] = useState<Staff | null>(null);

  useEffect(() => {
    fetchStaff();
    fetchRides();
    get_staff();
  }, []);

  const get_staff = async () => {
    const response = await invoke("get_current_staff");
    if (response !== null) {
      setCurrentStaff(response as Staff);
    }
  };

  async function fetchStaff() {
    try {
      const fetchedStaff: Staff[] = await invoke("get_all_maintenance_staffs");
      setAllStaff(fetchedStaff);
    } catch (error) {
      console.error("Failed to fetch staff:", error);
      setErrors("Failed to load maintenance staff. Please try again.");
    }
  }

  async function fetchRides() {
    try {
      const fetchedRides = await invoke("get_all_rides");
      setAllRides(fetchedRides as { ride_id: string; name: string }[]);
    } catch (error) {
      console.error("Failed to fetch rides:", error);
      setErrors("Failed to load rides. Please try again.");
    }
  }

  // Helper function to get staff name by ID
  const getStaffNameById = (staffId: string): string => {
    const staff = allStaff.find((s) => s.staff_id === staffId);
    return staff ? staff.name : staffId;
  };

  // Helper function to get ride name by ID
  const getRideNameById = (rideId: string): string => {
    const ride = allRides.find((r) => r.ride_id === rideId);
    return ride ? ride.name : rideId;
  };

  const handleAcceptClick = (report: Reports) => {
    setSelectedReport(report);
    setSelectedStaffId("");
    setIsDialogOpen(true);
  };

  const handleConfirmAssignment = () => {
    if (selectedReport && selectedStaffId) {
      selectedReport.assigned_to = selectedStaffId;
      onAccept(selectedReport, selectedStaffId);
      setIsDialogOpen(false);
    } else {
      setErrors("Please select a staff member");
    }
  };

  const handleSubmit = (report: Reports) => {
    if (onSubmit) {
      onSubmit(report);
    }
  };

  return (
    <>
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-black">Maintenance Reports</h2>
        </div>
        {reports.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <p className="text-gray-500 mb-2">
              No maintenance requests available.
            </p>
            <p className="text-sm text-gray-400">
              All rides are operating normally
            </p>
          </div>
        ) : (
          <ul className="space-y-6">
            {reports.map((report) => (
              <li
                key={report.report_id}
                className="p-5 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 flex gap-4 flex-col bg-gray-50"
              >
                <div className="flex justify-between items-center gap-6">
                  <div className="flex-1">
                    <p className="font-semibold text-lg">
                      Report ID: {report.report_id}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Ride:</span>{" "}
                      {getRideNameById(report.ride_id)}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">Source:</span>{" "}
                      {report.reported_by}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">Reason:</span>{" "}
                      {report.reason}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">Assigned:</span>{" "}
                      {report.assigned_to
                        ? getStaffNameById(report.assigned_to)
                        : "Not assigned yet"}
                    </p>
                    <p
                      className={`text-white rounded-full px-3 py-1 mt-2 text-xs font-medium inline-block ${
                        report.status === "Pending"
                          ? "bg-yellow-500"
                          : report.status === "Completed"
                          ? "bg-green-500"
                          : report.status === "In Progress"
                          ? "bg-blue-500"
                          : report.status === "Submitted"
                          ? "bg-emerald-500"
                          : "bg-red-500"
                      }`}
                    >
                      {report.status}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    {currentStaff?.role === "maintenance staff" ? (
                      <Button
                        onClick={() => handleSubmit(report)}
                        className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer flex justify-around"
                        disabled={report.status !== "In Progress"}
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Submit
                      </Button>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <Button
                          onClick={() => handleAcceptClick(report)}
                          className="bg-green-600 hover:bg-green-700 text-white cursor-pointer flex justify-around"
                          disabled={report.status !== "Pending"}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Accept Request
                        </Button>

                        <Button
                          onClick={() => onReject(report)}
                          className="bg-red-600 hover:bg-red-700 text-white cursor-pointer flex justify-around"
                          disabled={report.status !== "Pending"}
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject Request
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Staff Assignment Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Assign Maintenance Staff</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col space-y-4 py-4">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="staff-select">Select Maintenance Staff</Label>
              <Select
                value={selectedStaffId}
                onValueChange={setSelectedStaffId}
              >
                <SelectTrigger id="staff-select">
                  <SelectValue placeholder="Select a staff member" />
                </SelectTrigger>
                <SelectContent>
                  {allStaff.map((staff) => (
                    <SelectItem key={staff.staff_id} value={staff.staff_id}>
                      {staff.name} - {staff.role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors && <p className="text-sm text-red-500">{errors}</p>}
            </div>

            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-sm text-gray-700">
                Assigning this maintenance request will mark it as approved and
                assign the selected staff member to handle it.
              </p>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              onClick={handleConfirmAssignment}
              className="bg-green-600 hover:bg-green-700"
            >
              Confirm Assignment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
