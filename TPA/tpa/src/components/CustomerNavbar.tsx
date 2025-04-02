import { useNavigate } from "react-router";
import { useTime } from "./context/TimeContext";
import { useCustomer } from "@/hooks/use-customer";

type NavItem = {
  name: string;
  onClick: () => void;
};

type Props = {
  navItems: NavItem[];
};

export default function CustomerNavbar({ navItems }: Props) {
  const navigate = useNavigate();
  const customer = useCustomer();
  const { currentTime } = useTime();

  return (
    <div className="bg-gray-800 p-4">
      <div className="flex justify-between items-center">
        {/* Navigation Items */}
        <div className="flex justify-around items-center space-x-8">
          {navItems.map((item, index) => (
            <div
              key={index}
              className="text-white font-bold text-xl cursor-pointer px-2 py-2 rounded-lg hover:bg-gray-600"
              onClick={item.onClick}
            >
              {item.name}
            </div>
          ))}
        </div>

        {/* Right Side: Time, Balance, Customer Info, and Button */}
        <div className="flex space-x-4 items-center">
          <h2 className="text-white font-bold text-xl">
            {currentTime.toLocaleTimeString("en-US", { hour12: false })}
          </h2>
          {customer ? (
            <>
              <h2 className="text-white font-bold text-xl">
                Balance: Rp{customer.balance.toFixed(2)}
              </h2>
              <h2 className="text-white font-bold text-xl">
                Welcome, {customer.name}
              </h2>
              <button
                className="text-white bg-gray-600 px-4 py-2 rounded-lg hover:bg-gray-500 transition duration-200 ease-in-out cursor-pointer"
                onClick={() => navigate("/customer_login")}
              >
                Logout
              </button>
            </>
          ) : (
            <button
              className="text-white bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-500 transition duration-200 ease-in-out cursor-pointer"
              onClick={() => navigate("/customer_login")}
            >
              Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
