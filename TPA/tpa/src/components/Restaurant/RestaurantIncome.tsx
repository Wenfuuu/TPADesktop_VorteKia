import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function RestaurantIncome({
  restaurantId,
}: {
  restaurantId: string;
}) {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [transactions, setTransactions] = useState<RestaurantTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  async function getRestaurantDetails(id: string) {
    try {
      console.log(restaurant);
      const response = await invoke("get_restaurant_details", {
        restaurantid: id,
      });
      if (response !== null) {
        setRestaurant(response as Restaurant);
      }
    } catch (err) {
      toast(`Failed to get restaurant details: ${err}`);
    }
    return null;
  }

  async function getRestaurantTransactions(id: string) {
    try {
      const response = await invoke("get_transaction_by_restaurant", {
        restaurantid: id,
      });
      setTransactions(response as RestaurantTransaction[]);
    } catch (err) {
      toast(`Failed to get transactions: ${err}`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function loadData() {
      if (restaurantId) {
        await getRestaurantDetails(restaurantId);
        await getRestaurantTransactions(restaurantId);
      } else {
        setLoading(false);
        toast("No restaurant ID provided");
      }
    }

    loadData();
  }, [restaurantId]);

  // Calculate total income
  const totalIncome = transactions.reduce(
    (sum, transaction) => sum + transaction.total,
    0
  );

  // Get customer count (unique customers)
  const uniqueCustomers = new Set(
    transactions.map((transaction) => transaction.customer_id)
  );
  const customerCount = uniqueCustomers.size;

  // Get total items sold
  const totalItemsSold = transactions.reduce(
    (sum, transaction) => sum + transaction.quantity,
    0
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-800 rounded-lg">
        <div className="text-blue-400 animate-pulse font-medium">
          Loading restaurant income data...
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gray-800 rounded-lg shadow-xl text-gray-100">
      {/* Restaurant Header */}
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
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              ></path>
            </svg>
          </span>
          Restaurant Income Summary
        </h2>
        <div className="text-sm text-gray-400">ID: {restaurantId}</div>
      </div>

      {/* Restaurant Details Card */}
      {restaurant && (
        <div className="bg-gray-700 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col items-center">
              <span className="text-xs text-gray-400">Restaurant Name</span>
              <span className="text-lg font-medium">
                {restaurant.name || "Unnamed Restaurant"}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xs text-gray-400">Unique Customers</span>
              <span className="text-lg font-medium">{customerCount}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xs text-gray-400">Items Sold</span>
              <span className="text-lg font-medium">{totalItemsSold}</span>
            </div>
          </div>
        </div>
      )}

      {/* Income Summary Card */}
      <div className="bg-gray-700 rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Total Income */}
          <div className="bg-gray-800 rounded-lg p-4 flex flex-col items-center justify-center">
            <span className="text-xs text-gray-400 uppercase tracking-wider mb-1">
              Total Income
            </span>
            <span className="text-3xl font-bold text-green-400">
              Rp
              {totalIncome.toLocaleString("id-ID", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>

          {/* Transaction Count */}
          <div className="bg-gray-800 rounded-lg p-4 flex flex-col items-center justify-center">
            <span className="text-xs text-gray-400 uppercase tracking-wider mb-1">
              Total Orders
            </span>
            <span className="text-3xl font-bold text-blue-400">
              {transactions.length}
            </span>
          </div>
        </div>
      </div>

      {/* Transaction List */}
      <div className="bg-gray-900 rounded-lg overflow-hidden shadow-inner">
        <div className="flex justify-between items-center px-6 py-3 bg-gray-700">
          <h3 className="text-lg font-medium">Order Details</h3>
          <span className="text-sm text-gray-400">
            {transactions.length}{" "}
            {transactions.length === 1 ? "order" : "orders"}
          </span>
        </div>

        {transactions.length === 0 ? (
          <div className="p-8 text-center">
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
            <p className="text-xl text-gray-400">
              No orders found for this restaurant.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-800">
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
                    Customer ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    Menu ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    Quantity
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    Total
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
                      {transaction.customer_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {transaction.menu_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-300">
                      {transaction.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-green-400">
                      Rp
                      {transaction.total.toLocaleString("id-ID", {
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
                    colSpan={4}
                  >
                    Total Income
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-green-400">
                    Rp
                    {totalIncome.toLocaleString("id-ID", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      <div className="mt-6 text-xs text-gray-500 italic">
        * Income data is updated in real-time
      </div>
    </div>
  );
}
