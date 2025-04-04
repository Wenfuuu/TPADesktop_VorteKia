import { Button } from "@/components/ui/button";
import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import { Trash2, Edit, DollarSign, Search } from "lucide-react";
import AddMenuDialog from "./AddMenuDialog";
import EditMenuDialog from "./EditMenuDialog";
import { useStaff } from "@/hooks/use-staff";
import { Input } from "@/components/ui/input";
import { useCustomer } from "@/hooks/use-customer";
import OrderMenuDialog from "./OrderMenuDialog";
import { useDeviceId } from "@/hooks/use-device-id";
import { toast } from "sonner";

type Props = {
  restaurants: Restaurant[];
  onEdit: (restaurant: Restaurant) => void;
  onRemove: (restaurantId: string) => void;
  onAddMenu?: (restaurantId: string, menu: Omit<Menu, "menu_id">) => void;
  onUpdateMenu?: (menuId: string, updatedMenu: Partial<Menu>) => void;
  onRemoveMenu?: (menuId: string, restaurantId: string) => void;
  onIncome: (restaurant: Restaurant) => void;
};

export default function RestaurantList({
  restaurants,
  onEdit,
  onRemove,
  onAddMenu,
  onUpdateMenu,
  onRemoveMenu,
  onIncome,
}: Props) {
  const [imageUrls, setImageUrls] = useState<{ [key: string]: string }>({});
  const [menus, setMenus] = useState<{ [key: string]: Menu[] }>({});
  const [isLoading, setIsLoading] = useState<{ [key: string]: boolean }>({});
  const staff = useStaff();
  const customer = useCustomer();
  const deviceId = useDeviceId();
  const [searchMenu, setSearchMenu] = useState("");
  const [searchRestaurant, setSearchRestaurant] = useState("");
  const [searchCuisine, setSearchCuisine] = useState("");

  const handleOrder = async (
    menuId: string,
    qty: number,
    totalPrice: number
  ) => {
    console.log(
      `customer ${customer?.customer_id} place order for menu ${menuId}, quantity: ${qty}, restaurant: ${deviceId}`
    );
    console.log(`total price is ${totalPrice}`);

    //create order & transaction
    await invoke("create_order", {
      restaurantid: deviceId,
      menuid: menuId,
      customerid: customer?.customer_id,
      quantity: qty,
      price: totalPrice,
    })
      .then((success) => {
        if (success) {
          toast("Success placing order!");
        }
      })
      .catch((e) => {
        toast(e);
      });
  };

  const fetchMenus = async (restaurantId: string) => {
    // Skip if already loading this restaurant's menus
    if (isLoading[restaurantId]) return;

    // Set loading state for this restaurant
    setIsLoading((prev) => ({ ...prev, [restaurantId]: true }));

    try {
      const fetchedMenus: Menu[] = await invoke("get_menus_by_restaurant", {
        restaurantid: restaurantId,
      });
      console.log(`Fetched menus for ${restaurantId}:`, fetchedMenus);

      // Update menus state for this restaurant
      setMenus((prevMenus) => ({
        ...prevMenus,
        [restaurantId]: fetchedMenus,
      }));

      // Process menu images
      const newImageUrls: { [key: string]: string } = {};
      fetchedMenus.forEach((menu) => {
        if (menu.image) {
          const imageUrl = URL.createObjectURL(
            new Blob([new Uint8Array(menu.image)], { type: "image/png" })
          );
          newImageUrls[menu.menu_id] = imageUrl;
        }
      });

      // Update image URLs state
      setImageUrls((prevUrls) => ({
        ...prevUrls,
        ...newImageUrls,
      }));
    } catch (error) {
      console.error(`Failed to fetch menu for ${restaurantId}:`, error);
    } finally {
      // Clear loading state
      setIsLoading((prev) => ({ ...prev, [restaurantId]: false }));
    }
  };

  const handleAddMenu = (
    restaurantId: string,
    newMenu: Omit<Menu, "menu_id">
  ) => {
    if (onAddMenu) {
      onAddMenu(restaurantId, newMenu);
    }
  };

  const handleUpdateMenu = (menuId: string, updatedMenu: Partial<Menu>) => {
    if (onUpdateMenu) {
      onUpdateMenu(menuId, updatedMenu);
    }
  };

  useEffect(() => {
    // Process restaurant images
    const newImageUrls: { [key: string]: string } = {};

    restaurants.forEach((restaurant) => {
      if (restaurant.image) {
        const imageUrl = URL.createObjectURL(
          new Blob([new Uint8Array(restaurant.image)], {
            type: "image/png",
          })
        );
        newImageUrls[restaurant.restaurant_id] = imageUrl;
      }

      // Fetch menus for each restaurant
      fetchMenus(restaurant.restaurant_id);
    });

    // Update image URLs with restaurant images
    setImageUrls((prevUrls) => ({
      ...prevUrls,
      ...newImageUrls,
    }));

    // Cleanup function for image URLs
    return () => {
      Object.values(imageUrls).forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, [restaurants]); // Only re-run when restaurants change

  // Filter restaurants based on search input
  const filteredRestaurants = searchRestaurant
    ? restaurants.filter((restaurant) =>
        restaurant.name.toLowerCase().includes(searchRestaurant.toLowerCase())
      )
    : restaurants;

  // Filter restaurants based on cuisine type
  const filteredCuisineRestaurants = searchCuisine
    ? filteredRestaurants.filter((restaurant) =>
        restaurant.cuisine_type
          .toLowerCase()
          .includes(searchCuisine.toLowerCase())
      )
    : filteredRestaurants;

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-6 max-w-6xl mx-auto">
      {restaurants.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-40 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <p className="text-gray-500 mb-2">No restaurants available.</p>
          <p className="text-sm text-gray-400">
            Add a restaurant to get started
          </p>
        </div>
      ) : (
        <>
          {deviceId?.startsWith("CUSTOMER") && (
            <div>
              {/* Restaurant search input */}
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search restaurant name"
                    value={searchRestaurant}
                    onChange={(e) => setSearchRestaurant(e.target.value)}
                    className="pl-10 w-full"
                  />
                </div>
              </div>

              {/* Cuisine search input */}
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search cuisine type"
                    value={searchCuisine}
                    onChange={(e) => setSearchCuisine(e.target.value)}
                    className="pl-10 w-full"
                  />
                </div>
              </div>
            </div>
          )}

          <ul className="space-y-6">
            {filteredCuisineRestaurants.map((restaurant) => {
              const imageUrl = imageUrls[restaurant.restaurant_id];
              const restaurantMenus = menus[restaurant.restaurant_id] || [];
              const isMenuLoading = isLoading[restaurant.restaurant_id];

              // Filter menus based on search input
              const filteredMenus = searchMenu
                ? restaurantMenus.filter((menu) =>
                    menu.name.toLowerCase().includes(searchMenu.toLowerCase())
                  )
                : restaurantMenus;

              return (
                <li
                  key={restaurant.restaurant_id}
                  className="p-5 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 flex gap-4 flex-col bg-gray-50"
                >
                  <div className="flex justify-between items-center gap-6">
                    <div className="w-40 h-28 flex-shrink-0">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={restaurant.name}
                          className="w-full h-full object-cover rounded-lg border shadow-sm"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-lg">
                          <span className="text-gray-500 text-sm">
                            No Image
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <p className="font-semibold text-lg">{restaurant.name}</p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Cuisine:</span>{" "}
                        {restaurant.cuisine_type}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Hours:</span>{" "}
                        {restaurant.opening_hours} - {restaurant.closing_hours}
                      </p>
                      <p
                        className={`text-white rounded-full px-3 py-1 mt-2 text-xs font-medium inline-block ${
                          restaurant.status === "Open"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}
                      >
                        {restaurant.status}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2">
                      {staff && (
                        <Button
                          onClick={() => onEdit(restaurant)}
                          className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      )}

                      {staff?.role === "f&b supervisor" && (
                        <Button
                          onClick={() => onIncome(restaurant)}
                          className="bg-green-600 hover:bg-green-700 text-white cursor-pointer flex justify-around"
                        >
                          <DollarSign className="w-4 h-4 mr-2" />
                          View Income
                        </Button>
                      )}

                      {staff?.role === "f&b supervisor" && (
                        <Button
                          onClick={() => onRemove(restaurant.restaurant_id)}
                          className="bg-red-600 hover:bg-red-700 text-white cursor-pointer flex justify-around"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove Restaurant
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="mt-2 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center mb-3">
                      <h2 className="font-semibold text-gray-800">Menus</h2>
                      <AddMenuDialog
                        restaurantId={restaurant.restaurant_id}
                        onAddMenu={(newMenu) =>
                          handleAddMenu(restaurant.restaurant_id, newMenu)
                        }
                      />
                    </div>

                    {deviceId?.startsWith("RES") && (
                      <div className="mb-4">
                        {/* search menu here */}
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            type="text"
                            placeholder="Search menu"
                            value={searchMenu}
                            onChange={(e) => setSearchMenu(e.target.value)}
                            className="pl-10 w-full"
                          />
                        </div>
                      </div>
                    )}

                    {isMenuLoading ? (
                      <div className="flex items-center justify-center h-24 bg-gray-100 rounded-lg">
                        <p className="text-gray-500">Loading menus...</p>
                      </div>
                    ) : restaurantMenus.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {filteredMenus.map((menu) => (
                          <div
                            key={menu.menu_id}
                            className="flex items-center bg-white p-3 rounded-lg border border-gray-200 shadow-sm hover:border-gray-300"
                          >
                            {imageUrls[menu.menu_id] ? (
                              <img
                                src={imageUrls[menu.menu_id]}
                                alt={menu.name}
                                className="w-16 h-16 object-cover rounded-lg border mr-3"
                              />
                            ) : (
                              <div className="w-16 h-16 flex items-center justify-center bg-gray-200 rounded-lg border mr-3">
                                <span className="text-gray-500 text-xs">
                                  No Image
                                </span>
                              </div>
                            )}
                            <div className="flex-1">
                              <p className="font-medium text-gray-800">
                                {menu.name}
                              </p>
                              <p className="text-sm text-gray-600">
                                Rp{menu.price.toLocaleString()}
                              </p>
                            </div>
                            <div className="flex items-center">
                              <EditMenuDialog
                                menu={menu}
                                onUpdateMenu={(menuId, updatedMenu) =>
                                  handleUpdateMenu(menuId, updatedMenu)
                                }
                              />
                              {staff?.role === "f&b supervisor" && (
                                <Button
                                  onClick={() =>
                                    onRemoveMenu &&
                                    onRemoveMenu(
                                      menu.menu_id,
                                      restaurant.restaurant_id
                                    )
                                  }
                                  variant="destructive"
                                  size="sm"
                                  className="ml-2 h-8 w-8 p-0 cursor-pointer"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  <span className="sr-only">Delete menu</span>
                                </Button>
                              )}
                              {customer && deviceId?.startsWith("RES") && (
                                <OrderMenuDialog
                                  menu={menu}
                                  onOrder={handleOrder}
                                />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-24 bg-gray-100 rounded-lg border border-dashed border-gray-300">
                        <p className="text-gray-500 text-sm mb-1">
                          No menu items available
                        </p>
                        <p className="text-xs text-gray-400">
                          Click 'Add Menu Item' to add a menu
                        </p>
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}
