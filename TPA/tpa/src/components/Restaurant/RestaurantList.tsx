import { Button } from "@/components/ui/button";
import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import { Trash2, Edit } from "lucide-react";
import AddMenuDialog from "./AddMenuDialog";
import EditMenuDialog from "./EditMenuDialog";

type Props = {
  restaurants: Restaurant[];
  onEdit: (restaurant: Restaurant) => void;
  onAddMenu?: (restaurantId: string, menu: Omit<Menu, "menu_id">) => void;
  onUpdateMenu?: (menuId: string, updatedMenu: Partial<Menu>) => void;
  onRemoveMenu?: (menuId: string, restaurantId: string) => void;
};

export default function RestaurantList({
  restaurants,
  onEdit,
  onAddMenu,
  onUpdateMenu,
  onRemoveMenu,
}: Props) {
  const [imageUrls, setImageUrls] = useState<{ [key: string]: string }>({});
  const [menus, setMenus] = useState<{ [key: string]: Menu[] }>({});
  const [isLoading, setIsLoading] = useState<{ [key: string]: boolean }>({});

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
        <ul className="space-y-6">
          {restaurants.map((restaurant) => {
            const imageUrl = imageUrls[restaurant.restaurant_id];
            const restaurantMenus = menus[restaurant.restaurant_id] || [];
            const isMenuLoading = isLoading[restaurant.restaurant_id];

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
                        <span className="text-gray-500 text-sm">No Image</span>
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

                  <Button
                    onClick={() => onEdit(restaurant)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </div>

                <div className="mt-2 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center mb-3">
                    <h2 className="font-semibold text-gray-800">Menu Items</h2>
                    <AddMenuDialog
                      restaurantId={restaurant.restaurant_id}
                      onAddMenu={(newMenu) =>
                        handleAddMenu(restaurant.restaurant_id, newMenu)
                      }
                    />
                  </div>

                  {isMenuLoading ? (
                    <div className="flex items-center justify-center h-24 bg-gray-100 rounded-lg">
                      <p className="text-gray-500">Loading menus...</p>
                    </div>
                  ) : restaurantMenus.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {restaurantMenus.map((menu) => (
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
                              className="ml-2 h-8 w-8 p-0"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete menu</span>
                            </Button>
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
      )}
    </div>
  );
}
