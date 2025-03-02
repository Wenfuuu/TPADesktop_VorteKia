import { useEffect, useState } from "react";
import RideList from "./RideList";
import { invoke } from "@tauri-apps/api/core";
import { toast } from "sonner";
import EditRideDialog from "./EditRideDialog";
import RemoveRideDialog from "./RemoveRideDialog";
import MaintenanceDialog from "./MaintenanceDialog";

export default function RideView() {
    const [rides, setRides] = useState<Ride[]>([]);
    const [editingRide, setEditingRide] = useState<Ride | null>(null);
    const [removingRide, setRemovingRide] = useState<Ride | null>(null);
    const [maintenanceRide, setMaintenanceRide] = useState<Ride | null>(null);
    const [staff, setStaff] = useState<Staff | null>(null);

    useEffect(() =>{
        fetchRides();
        get_staff();
    }, [])

    const get_staff = async () => {
      const response = await invoke("get_current_staff");
      if (response !== null) {
        setStaff(response as Staff);
      }
    }

    const fetchRides = async () => {
        const rideData: Ride[] = await invoke("get_all_rides");

        const rideWithStaff = await Promise.all(
            rideData.map(async (ride) => {
                const allocatedStaff: Staff[] = await invoke(
                    "get_allocated_staff_in_ride",
                    { rideid: ride.ride_id }
                );

                return {
                    ...ride,
                    assigned_staff: allocatedStaff || [],
                };
            })
        )

        setRides(rideWithStaff);
    }

    const updateRide = (updatedRide: Ride) => {
        setRides((prevRides) =>
            prevRides.map((ride) =>
                ride.ride_id === updatedRide.ride_id ? updatedRide : ride
            )
        );

        invoke("update_ride", {
          id: updatedRide.ride_id,
          newName: updatedRide.name,
          newPrice: updatedRide.price,
          newOpeningHours: updatedRide.opening_hours,
          newClosingHours: updatedRide.closing_hours,
          newStatus: updatedRide.status,
          newimagedata: updatedRide.image,
        }).then((success) => {
          if (success) toast("Ride has been updated!");
        });

        if (
            updatedRide.assigned_staff &&
            updatedRide.assigned_staff.length > 0
        ){
            invoke("allocate_ride_staff", {
                rideId: updatedRide.ride_id,
                staffIds: updatedRide.assigned_staff.map(
                    (staff) => staff.staff_id
                ),
            }).then((success) => {
                if (success) toast("Staff has been allocated!");
            });
        }
    }

    const proposeRemoveRide = (ride: Ride, reason: string) => {
        invoke("propose_ride_removal", {
          rideid: ride.ride_id,
          staffid: staff?.staff_id,
          removereason: reason,
        }).then((success) => {
          if (success) toast("Ride removal has been proposed!");
        }).catch((e) =>{
            console.log(e);
            toast("Failed to propose ride removal!");
        })
    }

    const requestMaintenance = (ride: Ride, reason: string) => {
        invoke("request_maintenance", {
          rideid: ride.ride_id,
          staffid: staff?.staff_id,
          maintenancereason: reason,
        }).then((success) => {
          if (success) toast("Ride maintenance has been requested!");
        }).catch((e) =>{
            console.log(e);
            toast("Failed to request ride maintenance!");
        })
    }

    return (
      <div className="container mx-auto px-6">
        <RideList
          rides={rides}
          onEdit={setEditingRide}
          onRemove={setRemovingRide}
          onMaintenance={setMaintenanceRide}
        />

        {editingRide && (
          <EditRideDialog
            ride={editingRide}
            onUpdateRide={updateRide}
            onClose={() => setEditingRide(null)}
            open={true}
          />
        )}

        {maintenanceRide && (
            <MaintenanceDialog
                ride={maintenanceRide}
                onMaintenanceRide={requestMaintenance}
                onClose={() => setMaintenanceRide(null)}
                open={true}
            />
        )}

        {removingRide && (
            <RemoveRideDialog
                ride={removingRide}
                onRemoveRide={proposeRemoveRide}
                onClose={() => setRemovingRide(null)}
                open={true}
            />
        )}

      </div>
    );
}
