import { useCustomer } from "@/hooks/use-customer";
import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";

export default function RideHistory() {
  const [transactions, setTransactions] = useState<RideTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const customer = useCustomer();

  async function getTransactions(customerId: string) {
    try {
      const response = await invoke("get_all_customer_ride_transactions", {
        customerid: customerId,
      });
      setTransactions(response as RideTransaction[]);
    } catch (err) {
      setError(`Failed to get transactions: ${err}`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function loadData() {
      if (customer) {
        await getTransactions(customer.customer_id);
      } else {
        setLoading(false);
      }
    }

    loadData();
  }, [customer]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-800 rounded-lg">
        <div className="text-blue-400 animate-pulse font-medium">
          Loading transaction history...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-900 text-red-100 rounded-lg shadow-lg border border-red-700">
        <div className="flex items-center mb-2">
          <svg
            className="w-6 h-6 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <h3 className="text-lg font-bold">Error</h3>
        </div>
        <p>{error}</p>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="p-6 bg-gray-800 text-gray-200 rounded-lg shadow-lg">
        <div className="flex flex-col items-center justify-center h-32">
          <svg
            className="w-12 h-12 mb-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            ></path>
          </svg>
          <p className="text-center">
            Please log in to view your ride history.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gray-800 rounded-lg shadow-xl text-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-400">
          <span className="inline-block mr-2">
            <svg
              className="w-6 h-6 inline"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              ></path>
            </svg>
          </span>
          Ride Transaction History
        </h2>
        <div className="text-sm text-gray-400">
          {transactions.length}{" "}
          {transactions.length === 1 ? "transaction" : "transactions"} found
        </div>
      </div>

      {transactions.length === 0 ? (
        <div className="bg-gray-700 rounded-lg p-8 text-center">
          <svg
            className="w-16 h-16 mx-auto mb-4 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <p className="text-xl text-gray-400">No ride transactions found.</p>
          <p className="mt-2 text-gray-500">
            Your transaction history will appear here once you've completed
            rides.
          </p>
        </div>
      ) : (
        <div className="bg-gray-900 rounded-lg overflow-hidden shadow-inner">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    Transaction ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    Ride ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {transactions.map((transaction) => (
                  <tr
                    key={transaction.transaction_id}
                    className="transition-colors hover:bg-gray-800"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-400">
                      {transaction.transaction_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {transaction.ride_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-green-400">
                      Rp
                      {transaction.amount.toLocaleString("id-ID", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-700">
                  <td
                    className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-200"
                    colSpan={2}
                  >
                    Total Amount
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-green-400">
                    Rp
                    {transactions
                      .reduce((sum, transaction) => sum + transaction.amount, 0)
                      .toLocaleString("id-ID", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      <div className="mt-6 text-xs text-gray-500 italic">
        * Transaction history is updated in real-time
      </div>
    </div>
  );
}
