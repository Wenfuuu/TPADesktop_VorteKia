import { Button } from "../ui/button";
import { CheckCircle, XCircle } from "lucide-react";

type Props = {
    maintenances: Maintenance[];
    onAccept: (maintenance: Maintenance) => void;
    onReject: (maintenance: Maintenance) => void;
};

export default function MaintenanceList({
  maintenances,
  onAccept,
  onReject,
}: Props) {
    

    return (
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6 max-w-6xl mx-auto">
        {maintenances.length === 0 ? (
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
            {maintenances.map((maintenance) => (
                <li
                key={maintenance.maintenance_id}
                className="p-5 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 flex gap-4 flex-col bg-gray-50"
                >
                <div className="flex justify-between items-center gap-6">
                    <div className="flex-1">
                    <p className="font-semibold text-lg">
                        Maintenance ID: {maintenance.maintenance_id}
                    </p>
                    <p className="text-sm text-gray-600">
                        <span className="font-medium">Ride ID:</span>{" "}
                        {maintenance.ride_id}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                        <span className="font-medium">Staff ID:</span>{" "}
                        {maintenance.staff_id}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                        <span className="font-medium">Reason:</span>{" "}
                        {maintenance.reason}
                    </p>
                    <p
                        className={`text-white rounded-full px-3 py-1 mt-2 text-xs font-medium inline-block ${
                        maintenance.status === "Pending"
                            ? "bg-yellow-500"
                            : maintenance.status === "Approved"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                    >
                        {maintenance.status}
                    </p>
                    </div>

                    <div className="flex flex-col gap-2">
                    <Button
                        onClick={() => onAccept(maintenance)}
                        className="bg-green-600 hover:bg-green-700 text-white cursor-pointer flex justify-around"
                        disabled={maintenance.status !== "Pending"}
                    >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Accept Request
                    </Button>

                    <Button
                        onClick={() => onReject(maintenance)}
                        className="bg-red-600 hover:bg-red-700 text-white cursor-pointer flex justify-around"
                        disabled={maintenance.status !== "Pending"}
                    >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject Request
                    </Button>
                    </div>
                </div>
                </li>
            ))}
            </ul>
        )}
        </div>
    );
}
