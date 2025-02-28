type ItemStatus = "Returned to Owner" | "Found" | "Missing"

type LostAndFoundItem = {
  item_id: string
  image: Uint8Array | null
  name: string
  item_type: string
  color: string
  last_seen_location: string
  found_location: string
  finder: string
  owner: string
  status: ItemStatus
}