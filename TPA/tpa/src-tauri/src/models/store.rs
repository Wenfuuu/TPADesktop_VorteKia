use serde::{Serialize, Deserialize};
use crate::schema::stores;
use diesel::prelude::*;
use chrono::NaiveTime;

#[derive(Debug, Queryable, Insertable, AsChangeset, Clone)]
#[diesel(table_name = stores)]
pub struct Store{
    pub store_id: String,
    pub name: String,
    pub opening_hours: NaiveTime,
    pub closing_hours: NaiveTime,
    pub status: String,
    pub image: Option<Vec<u8>>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct StoreDTO {
    pub store_id: String,
    pub name: String,
    pub opening_hours: String,
    pub closing_hours: String,
    pub status: String,
    pub image: Option<Vec<u8>>,
}

impl From<Store> for StoreDTO {
    fn from(store: Store) -> Self {
        Self {
            store_id: store.store_id,
            name: store.name,
            opening_hours: store.opening_hours.format("%H:%M:%S").to_string(),
            closing_hours: store.closing_hours.format("%H:%M:%S").to_string(),
            status: store.status,
            image: store.image,
        }
    }
}

impl From<StoreDTO> for Store {
    fn from(dto: StoreDTO) -> Self {
        Self {
            store_id: dto.store_id,
            name: dto.name,
            opening_hours: NaiveTime::parse_from_str(&dto.opening_hours, "%H:%M:%S")
                .expect("Invalid time format"),
            closing_hours: NaiveTime::parse_from_str(&dto.closing_hours, "%H:%M:%S")
                .expect("Invalid time format"),
            status: dto.status,
            image: dto.image,
        }
    }
}