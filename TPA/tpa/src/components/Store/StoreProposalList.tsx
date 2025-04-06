import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import { invoke } from "@tauri-apps/api/core";

type Props = {
  newProposals: NewStoreProposal[];
  removeProposals: StoreRemovalProposal[];
  onAcceptNew: (proposal: NewStoreProposal) => void;
  onRejectNew: (proposal: NewStoreProposal) => void;
  onAcceptRemove: (proposal: StoreRemovalProposal) => void;
  onRejectRemove: (proposal: StoreRemovalProposal) => void;
};

export default function StoreProposalList({
  newProposals,
  removeProposals,
  onAcceptNew,
  onRejectNew,
  onAcceptRemove,
  onRejectRemove,
}: Props) {
  const [allStaff, setAllStaff] = useState<Staff[]>([]);
  const [allStores, setAllStores] = useState<
    { store_id: string; name: string }[]
  >([]);
  const [errors, setErrors] = useState("");
  const [imageUrls, setImageUrls] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchAllStaff();
    fetchStores();
    processImages();
  }, [newProposals]);

  useEffect(() => {
    return () => {
      Object.values(imageUrls).forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imageUrls]);

  const processImages = () => {
    const newImageUrls: { [key: string]: string } = {};
    newProposals.forEach((proposal) => {
      if (proposal.image && proposal.image.length > 0) {
        const imageUrl = URL.createObjectURL(
          new Blob([new Uint8Array(proposal.image)], { type: "image/png" })
        );
        newImageUrls[proposal.proposal_id] = imageUrl;
      }
    });

    setImageUrls((prevUrls) => ({
      ...prevUrls,
      ...newImageUrls,
    }));
  };

  const fetchAllStaff = async () => {
    try {
      const fetchedStaff: Staff[] = await invoke("get_all_staffs");
      setAllStaff(fetchedStaff);
    } catch (error) {
      console.error("Failed to fetch staff:", error);
      setErrors("Failed to load staff. Please try again.");
    }
  };

  const fetchStores = async () => {
    try {
      const fetchedStores = await invoke("get_all_stores");
      setAllStores(fetchedStores as { store_id: string; name: string }[]);
    } catch (error) {
      console.error("Failed to fetch stores:", error);
      setErrors("Failed to load stores. Please try again.");
    }
  };

  const getStaffNameById = (staffId: string): string => {
    const staff = allStaff.find((s) => s.staff_id === staffId);
    return staff ? staff.name : staffId;
  };

  const getStoreNameById = (storeId: string): string => {
    const store = allStores.find((s) => s.store_id === storeId);
    return store ? store.name : storeId;
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* New Store Proposals */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-bold text-black mb-6">
          New Store Proposals
        </h2>
        {newProposals.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <p className="text-gray-500 mb-2">
              No new store proposals available.
            </p>
            <p className="text-sm text-gray-400">
              All proposals have been reviewed
            </p>
          </div>
        ) : (
          <ul className="space-y-6">
            {newProposals.map((proposal) => (
              <li
                key={proposal.proposal_id}
                className="p-5 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 flex gap-4 flex-col bg-gray-50"
              >
                <div className="flex justify-between items-start gap-6">
                  <div className="flex-1">
                    <p className="font-semibold text-lg">
                      Proposal ID: {proposal.proposal_id}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Store Name:</span>{" "}
                      {proposal.store_name}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">Proposed by:</span>{" "}
                      {getStaffNameById(proposal.staff_id)}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">Description:</span>{" "}
                      {proposal.description}
                    </p>
                    <p
                      className={`text-white rounded-full px-3 py-1 mt-2 text-xs font-medium inline-block ${
                        proposal.status === "Pending"
                          ? "bg-yellow-500"
                          : proposal.status === "Accepted"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    >
                      {proposal.status}
                    </p>
                  </div>

                  {imageUrls[proposal.proposal_id] && (
                    <div className="w-32 h-32 overflow-hidden rounded-md flex-shrink-0">
                      <img
                        src={imageUrls[proposal.proposal_id]}
                        alt="Store preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={() => onAcceptNew(proposal)}
                      className="bg-green-600 hover:bg-green-700 text-white"
                      disabled={proposal.status !== "Pending"}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      onClick={() => onRejectNew(proposal)}
                      className="bg-red-600 hover:bg-red-700 text-white"
                      disabled={proposal.status !== "Pending"}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Store Removal Proposals */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-bold text-black mb-6">
          Store Removal Proposals
        </h2>
        {removeProposals.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <p className="text-gray-500 mb-2">
              No store removal proposals available.
            </p>
            <p className="text-sm text-gray-400">
              All proposals have been reviewed
            </p>
          </div>
        ) : (
          <ul className="space-y-6">
            {removeProposals.map((proposal) => (
              <li
                key={proposal.proposal_id}
                className="p-5 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 flex gap-4 flex-col bg-gray-50"
              >
                <div className="flex justify-between items-center gap-6">
                  <div className="flex-1">
                    <p className="font-semibold text-lg">
                      Proposal ID: {proposal.proposal_id}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Store:</span>{" "}
                      {getStoreNameById(proposal.store_id)}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">Proposed by:</span>{" "}
                      {getStaffNameById(proposal.staff_id)}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="font-medium">Reason:</span>{" "}
                      {proposal.reason}
                    </p>
                    <p
                      className={`text-white rounded-full px-3 py-1 mt-2 text-xs font-medium inline-block ${
                        proposal.status === "Pending"
                          ? "bg-yellow-500"
                          : proposal.status === "Accepted"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    >
                      {proposal.status}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={() => onAcceptRemove(proposal)}
                      className="bg-green-600 hover:bg-green-700 text-white"
                      disabled={proposal.status !== "Pending"}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      onClick={() => onRejectRemove(proposal)}
                      className="bg-red-600 hover:bg-red-700 text-white"
                      disabled={proposal.status !== "Pending"}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {errors && <p className="text-sm text-red-500 mt-4">{errors}</p>}
    </div>
  );
}
