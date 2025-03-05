use serde::{Serialize, Deserialize};
use crate::schema::rides;
use diesel::prelude::*;
use chrono::NaiveTime;

#[derive(Debug, Queryable, Insertable, AsChangeset, Clone, Selectable)]
#[diesel(table_name = rides)]
pub struct Ride{
    pub ride_id: String,
    pub name: String,
    pub price: i32,
    pub opening_hours: NaiveTime,
    pub closing_hours: NaiveTime,
    pub status: String,
    pub image: Option<Vec<u8>>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct RideDTO {
    pub ride_id: String,
    pub name: String,
    pub price: i32,
    pub opening_hours: String,
    pub closing_hours: String,
    pub status: String,
    pub image: Option<Vec<u8>>,
}

impl From<Ride> for RideDTO {
    fn from(ride: Ride) -> Self {
        Self {
            ride_id: ride.ride_id,
            name: ride.name,
            price: ride.price,
            opening_hours: ride.opening_hours.format("%H:%M:%S").to_string(),
            closing_hours: ride.closing_hours.format("%H:%M:%S").to_string(),
            status: ride.status,
            image: ride.image,
        }
    }
}

impl From<RideDTO> for Ride {
    fn from(dto: RideDTO) -> Self {
        Self {
            ride_id: dto.ride_id,
            name: dto.name,
            price: dto.price,
            opening_hours: NaiveTime::parse_from_str(&dto.opening_hours, "%H:%M:%S")
                .expect("Invalid time format"),
            closing_hours: NaiveTime::parse_from_str(&dto.closing_hours, "%H:%M:%S")
                .expect("Invalid time format"),
            status: dto.status,
            image: dto.image,
        }
    }
}