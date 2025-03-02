type Ride = {
    ride_id: string
    name: string
    price: number
    opening_hours: string
    closing_hours: string
    status: string
    image: Uint8Array | null
    assigned_staff: Staff[] | null
}