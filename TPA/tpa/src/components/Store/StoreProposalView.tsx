import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import StoreProposalList from "./StoreProposalList";
import { useStaff } from "@/hooks/use-staff";

export default function StoreProposalView() {
  const [newStoreProposals, setNewStoreProposals] = useState<
    NewStoreProposal[]
  >([]);
  const [storeRemovalProposals, setStoreRemovalProposals] = useState<
    StoreRemovalProposal[]
  >([]);
  const staff = useStaff();

  useEffect(() => {
    if (staff) {
      fetchNewStoreProposals();
      fetchStoreRemovalProposals();
    }
  }, [staff]);

  const fetchNewStoreProposals = async () => {
    if (!staff) return;
    let proposalData: NewStoreProposal[] = await invoke(
      "get_all_new_store_proposals"
    );
    console.log(proposalData);
    setNewStoreProposals(proposalData);
  };

  const fetchStoreRemovalProposals = async () => {
    if (!staff) return;
    let proposalData: StoreRemovalProposal[] = await invoke(
      "get_all_store_removal_proposals"
    );
    console.log(proposalData);
    setStoreRemovalProposals(proposalData);
  };

  const handleAcceptNewStoreProposal = (proposal: NewStoreProposal) => {
    invoke("accept_new_store_proposal", {
      proposalid: proposal.proposal_id,
    })
      .then((success) => {
        if (success) {
          toast("New store proposal has been accepted!");
          fetchNewStoreProposals();
        }
      })
      .catch((e) => {
        console.log(e);
        toast("Failed to accept new store proposal!");
      });
  };

  const handleRejectNewStoreProposal = (proposal: NewStoreProposal) => {
    invoke("reject_new_store_proposal", {
      proposalid: proposal.proposal_id,
    })
      .then((success) => {
        if (success) {
          toast("New store proposal has been rejected!");
          fetchNewStoreProposals();
        }
      })
      .catch((e) => {
        console.log(e);
        toast("Failed to reject new store proposal!");
      });
  };

  const handleAcceptStoreRemovalProposal = (proposal: StoreRemovalProposal) => {
    invoke("accept_store_removal_proposal", {
      proposalid: proposal.proposal_id,
    })
      .then((success) => {
        if (success) {
          toast("Store removal proposal has been accepted!");
          fetchStoreRemovalProposals();
        }
      })
      .catch((e) => {
        console.log(e);
        toast("Failed to accept store removal proposal!");
      });
  };

  const handleRejectStoreRemovalProposal = (proposal: StoreRemovalProposal) => {
    invoke("reject_store_removal_proposal", {
      proposalid: proposal.proposal_id,
    })
      .then((success) => {
        if (success) {
          toast("Store removal proposal has been rejected!");
          fetchStoreRemovalProposals();
        }
      })
      .catch((e) => {
        console.log(e);
        toast("Failed to reject store removal proposal!");
      });
  };

  return (
    <div className="container mx-auto px-6">
      <StoreProposalList
        newProposals={newStoreProposals}
        removeProposals={storeRemovalProposals}
        onAcceptNew={handleAcceptNewStoreProposal}
        onRejectNew={handleRejectNewStoreProposal}
        onAcceptRemove={handleAcceptStoreRemovalProposal}
        onRejectRemove={handleRejectStoreRemovalProposal}
      />
    </div>
  );
}
