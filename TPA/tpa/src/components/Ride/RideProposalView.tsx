import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import RideProposalList from "./RideProposalList";
import { useStaff } from "@/hooks/use-staff";

export default function RideProposalView(){
    const [newRideProposals, setNewRideProposals] = useState<NewRideProposal[]>([])
    const [rideRemovalProposals, setRideRemovalProposals] = useState<RideRemovalProposal[]>([])
    const staff = useStaff();

    useEffect(() => {
      if (staff) {
        fetchNewRideProposals();
        fetchRideRemovalProposals();
      }
    }, [staff]);

    const fetchNewRideProposals = async () => {
        if (!staff) return;
        let proposalData: NewRideProposal[] = await invoke("get_all_new_ride_proposals");
        console.log(proposalData)
        setNewRideProposals(proposalData);
    }

    const fetchRideRemovalProposals = async () => {
        if (!staff) return;
        let proposalData: RideRemovalProposal[] = await invoke("get_all_ride_removal_proposals");
        console.log(proposalData)
        setRideRemovalProposals(proposalData);
    }

    const handleAcceptNewRideProposal = (proposal: NewRideProposal) => {
        invoke("accept_new_ride_proposal", {
            proposalid: proposal.proposal_id,
        }).then((success) => {
          if (success) {
            toast("New ride proposal has been accepted!");
            fetchNewRideProposals();
          }
        }).catch((e) => {
          console.log(e);
          toast("Failed to accept new ride proposal!");
        });
    };

    const handleRejectNewRideProposal = (proposal: NewRideProposal) => {
        invoke("reject_new_ride_proposal", {
            proposalid: proposal.proposal_id
        }).then((success) => {
            if (success) {
                toast("New ride proposal has been rejected!");
                fetchNewRideProposals();
            }
        }).catch((e) => {
            console.log(e);
            toast("Failed to reject new ride proposal!");
        })
    }

    const handleAcceptRideRemovalProposal = (proposal: RideRemovalProposal) => {
        invoke("accept_ride_removal_proposal", {
            proposalid: proposal.proposal_id,
        }).then((success) => {
          if (success) {
            toast("Ride removal proposal has been accepted!");
            fetchRideRemovalProposals();
          }
        }).catch((e) => {
          console.log(e);
          toast("Failed to accept ride removal proposal!");
        });
    }

    const handleRejectRideRemovalProposal = (proposal: RideRemovalProposal) => {
        invoke("reject_ride_removal_proposal", {
          proposalid: proposal.proposal_id,
        }).then((success) => {
            if (success) {
              toast("Ride removal proposal has been rejected!");
              fetchRideRemovalProposals();
            }
        }).catch((e) => {
            console.log(e);
            toast("Failed to reject ride removal proposal!");
        });
    }

    return(
        <div className="container mx-auto px-6">
            <RideProposalList
            newProposals={newRideProposals}
            removeProposals={rideRemovalProposals}
            onAcceptNew={handleAcceptNewRideProposal}
            onRejectNew={handleRejectNewRideProposal}
            onAcceptRemove={handleAcceptRideRemovalProposal}
            onRejectRemove={handleRejectRideRemovalProposal}
            />
        </div>
    )
}