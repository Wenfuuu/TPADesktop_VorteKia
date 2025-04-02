use serde::{Serialize, Deserialize};
use crate::schema::restaurants;
use diesel::prelude::*;
use chrono::NaiveTime;

#[derive(Debug, Queryable, Insertable, AsChangeset, Clone, Selectable)]
#[diesel(table_name = restaurants)]
pub struct Restaurant{
    pub restaurant_id: String,
    pub name: String,
    pub cuisine_type: String,
    pub opening_hours: NaiveTime,
    pub closing_hours: NaiveTime,
    pub status: String,
    pub image: Option<Vec<u8>>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct RestaurantDTO {
    pub restaurant_id: String,
    pub name: String,
    pub cuisine_type: String,
    pub opening_hours: String,  //String for serialization
    pub closing_hours: String,  //String for serialization
    pub status: String,
    pub image: Option<Vec<u8>>,
}

impl From<Restaurant> for RestaurantDTO {
    fn from(restaurant: Restaurant) -> Self {
        Self {
            restaurant_id: restaurant.restaurant_id,
            name: restaurant.name,
            cuisine_type: restaurant.cuisine_type,
            opening_hours: restaurant.opening_hours.format("%H:%M:%S").to_string(),
            closing_hours: restaurant.closing_hours.format("%H:%M:%S").to_string(),
            status: restaurant.status,
            image: restaurant.image,
        }
    }
}

impl From<RestaurantDTO> for Restaurant {
    fn from(dto: RestaurantDTO) -> Self {
        Self {
            restaurant_id: dto.restaurant_id,
            name: dto.name,
            cuisine_type: dto.cuisine_type,
            opening_hours: NaiveTime::parse_from_str(&dto.opening_hours, "%H:%M:%S")
                .expect("Invalid time format"),
            closing_hours: NaiveTime::parse_from_str(&dto.closing_hours, "%H:%M:%S")
                .expect("Invalid time format"),
            status: dto.status,
            image: dto.image,
        }
    }
}