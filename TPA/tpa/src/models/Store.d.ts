type Store = {
    store_id: string
    name: string
    opening_hours: string
    closing_hours: string
    status: string
    image: Uint8Array | null
    assigned_staff: Staff[] | null
}