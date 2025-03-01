import { Button } from "@/components/ui/button";
import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";

type Props = {
  restaurants: Restaurant[];
  onEdit: (restaurant: Restaurant) => void;
};

export default function RestaurantList({ restaurants, onEdit }: Props) {
  const [imageUrls, setImageUrls] = useState<{ [key: string]: string }>({});
  const [menus, setMenus] = useState<{ [key: string]: Menu[] }>({});
  const urls: { [key: string]: string } = {};
  const menusData: { [key: string]: Menu[] } = {};

  const fetchMenus = async (restaurantid: string) => {
    try {
      const fetchedMenus: Menu[] = await invoke("get_menus_by_restaurant", {
        restaurantid: restaurantid,
      });
      console.log(fetchedMenus);

      // get menus url
      fetchedMenus.forEach((menu) => {
        if (menu.image) {
          const imageUrl = menu.image
            ? URL.createObjectURL(
                new Blob([new Uint8Array(menu.image)], { type: "image/png" })
              )
            : "";
          urls[menu.menu_id] = imageUrl;
        }
      });
      setImageUrls(urls);

      menusData[restaurantid] = fetchedMenus;
      setMenus(menusData);
    } catch (error) {
      console.error(`Failed to fetch menu for ${restaurantid}:`, error);
    }
  };

  useEffect(() => {
    restaurants.forEach((restaurant) => {
      if (restaurant.image) {
        const imageUrl = restaurant.image
          ? URL.createObjectURL(
              new Blob([new Uint8Array(restaurant.image)], {
                type: "image/png",
              })
            )
          : "";
        urls[restaurant.restaurant_id] = imageUrl;
      }

      // fetch menus
      fetchMenus(restaurant.restaurant_id);
    });
    setImageUrls(urls);
  }, [restaurants]);

  return (
    <div className="bg-white shadow-md rounded-lg p-5 mb-6">
      {restaurants.length === 0 ? (
        <p className="text-gray-500">No restaurants available.</p>
      ) : (
        <ul className="space-y-4">
          {restaurants.map((restaurant) => {
            const imageUrl = imageUrls[restaurant.restaurant_id];

            return (
              <li
                key={restaurant.restaurant_id}
                className="p-4 border rounded-lg flex gap-4 flex-col"
              >
                <div className="flex justify-between items-center gap-4">
                  
                  <div className="w-40 h-28 flex-shrink-0">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={restaurant.name}
                        className="w-full h-full object-cover rounded-lg border"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-lg">
                        <span className="text-gray-500 text-sm">No Image</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <p className="font-semibold">{restaurant.name}</p>
                    <p className="text-sm text-gray-600">
                      Cuisine: {restaurant.cuisine_type}
                    </p>
                    <p className="text-sm text-gray-600">
                      Operating Hours: {restaurant.opening_hours} -{" "}
                      {restaurant.closing_hours}
                    </p>
                    <p
                      className={`text-white rounded-sm px-2 py-1 mt-2 inline-block ${
                        restaurant.status === "Open"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    >
                      {restaurant.status}
                    </p>
                  </div>

                  <Button onClick={() => onEdit(restaurant)}>View Details</Button>
                </div>

                <div>
                  <h2 className="font-semibold">Menu List</h2>
                  {menus[restaurant.restaurant_id]?.length ? (
                    <ul>
                      {menus[restaurant.restaurant_id].map((menu) => (
                        <li key={menu.menu_id} className="text-gray-700 flex">
                          {imageUrls[menu.menu_id] ? (
                            <img
                              src={imageUrls[menu.menu_id]}
                              alt={menu.name}
                              className="w-16 h-16 object-cover rounded-lg border mr-2"
                            />
                          ) : (
                            <div className="w-16 h-16 flex items-center justify-center bg-gray-200 rounded-lg border mr-2">
                              <span className="text-gray-500 text-xs">
                                No Image
                              </span>
                            </div>
                          )}
                          <p>
                            {menu.name} - Rp{menu.price}
                          </p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No menu available.</p>
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
