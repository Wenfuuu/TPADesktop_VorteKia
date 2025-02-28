type Props = {
  items: LostAndFoundItem[];
  onEdit: (item: LostAndFoundItem) => void;
};

export default function LostAndFoundList({ items, onEdit }: Props) {
  return (
    <div className="bg-white shadow-md rounded-lg p-5 mb-6">
      <h2 className="text-xl font-semibold mb-3">Lost & Found Items</h2>
      {items.length === 0 ? (
        <p className="text-gray-500">No lost items.</p>
      ) : (
        <ul className="space-y-4">
          {items.map((item) => {
            const imageUrl = item.image
              ? URL.createObjectURL(
                  new Blob([new Uint8Array(item.image)], { type: "image/png" })
                )
              : "";
            console.log(imageUrl)

            return (
              <li
                key={item.item_id}
                className="p-4 border rounded-lg flex items-center gap-4"
              >
                {/* Image on the left */}
                <div className="w-40 h-24 flex-shrink-0">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-lg border"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-lg">
                      <span className="text-gray-500 text-sm">No Image</span>
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <p className="font-semibold">
                    {item.name} ({item.item_type})
                  </p>
                  <p className="text-sm text-gray-600">Color: {item.color}</p>
                  <p className="text-sm text-gray-600">Owner: {item.owner}</p>
                  <p className="text-sm font-semibold mt-2">
                    Status:{" "}
                    <span
                      className={`px-2 py-1 rounded text-white ${
                        item.status === "Missing"
                          ? "bg-red-500"
                          : item.status === "Found"
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                    >
                      {item.status}
                    </span>
                  </p>
                </div>

                <button
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  onClick={() => onEdit(item)}
                >
                  Update
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
