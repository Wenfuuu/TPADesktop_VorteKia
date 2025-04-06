import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import RestaurantProposalList from "./RestaurantProposalList";
import { useStaff } from "@/hooks/use-staff";

export default function RestaurantProposalView() {
    const [newRestaurantProposals, setNewRestaurantProposals] = useState<NewRestaurantProposal[]>([])
    const staff = useStaff();

    useEffect(() => {
        if(staff){
            fetchNewRestaurantProposals();
        }
    }, [staff])

    const fetchNewRestaurantProposals = async () => {
        if(!staff) return;
        const proposalData: NewRestaurantProposal[] = await invoke("get_all_new_restaurant_proposals");
        console.log(proposalData)
        setNewRestaurantProposals(proposalData);
    }

    const handleAcceptNewRestaurantProposal = (proposal: NewRestaurantProposal) => {
        invoke("accept_new_restaurant_proposal", {
            proposalid: proposal.proposal_id,
        }).then((success) => {
            if (success) {
                toast("New restaurant proposal has been accepted!");
                fetchNewRestaurantProposals();
            }
        }).catch((e) => {
            console.log(e);
            toast("Failed to accept new restaurant proposal!");
        });
    }

    const handleRejectNewRestaurantProposal = (proposal: NewRestaurantProposal) => {
        invoke("reject_new_restaurant_proposal", {
            proposalid: proposal.proposal_id
        }).then((success) => {
            if (success) {
                toast("New restaurant proposal has been rejected!");
                fetchNewRestaurantProposals();
            }
        }).catch((e) => {
            console.log(e);
            toast("Failed to reject new restaurant proposal!");
        })
    }

    return (
        <div className="container mx-auto px-6">
            <RestaurantProposalList
            newProposals={newRestaurantProposals}
            onAcceptNew={handleAcceptNewRestaurantProposal}
            onRejectNew={handleRejectNewRestaurantProposal}
            />
        </div>
    )
}
