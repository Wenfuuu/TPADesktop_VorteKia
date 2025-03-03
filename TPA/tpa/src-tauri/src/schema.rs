// @generated automatically by Diesel CLI.

diesel::table! {
    customers (customer_id) {
        #[max_length = 255]
        customer_id -> Varchar,
        #[max_length = 255]
        name -> Varchar,
    }
}

diesel::table! {
    lostandfounditems (item_id) {
        #[max_length = 255]
        item_id -> Varchar,
        #[max_length = 255]
        name -> Varchar,
        #[max_length = 255]
        item_type -> Varchar,
        #[max_length = 255]
        color -> Varchar,
        #[max_length = 255]
        last_seen_location -> Varchar,
        #[max_length = 255]
        found_location -> Nullable<Varchar>,
        #[max_length = 255]
        owner -> Varchar,
        #[max_length = 255]
        finder -> Nullable<Varchar>,
        #[max_length = 255]
        status -> Varchar,
        image -> Nullable<Bytea>,
    }
}

diesel::table! {
    maintenances (maintenance_id) {
        #[max_length = 255]
        maintenance_id -> Varchar,
        #[max_length = 255]
        ride_id -> Varchar,
        #[max_length = 255]
        staff_id -> Varchar,
        #[max_length = 255]
        reason -> Varchar,
        #[max_length = 255]
        status -> Varchar,
        created_at -> Nullable<Timestamp>,
    }
}

diesel::table! {
    menus (menu_id) {
        #[max_length = 255]
        menu_id -> Varchar,
        #[max_length = 255]
        restaurant_id -> Varchar,
        #[max_length = 255]
        name -> Varchar,
        price -> Int4,
        image -> Nullable<Bytea>,
    }
}

diesel::table! {
    new_ride_proposals (proposal_id) {
        #[max_length = 255]
        proposal_id -> Varchar,
        #[max_length = 255]
        staff_id -> Varchar,
        #[max_length = 255]
        ride_name -> Varchar,
        #[max_length = 255]
        description -> Varchar,
        image -> Nullable<Bytea>,
        created_at -> Nullable<Timestamp>,
    }
}

diesel::table! {
    restaurant_staffs (restaurant_id, staff_id) {
        #[max_length = 255]
        restaurant_id -> Varchar,
        #[max_length = 255]
        staff_id -> Varchar,
    }
}

diesel::table! {
    restaurants (restaurant_id) {
        #[max_length = 255]
        restaurant_id -> Varchar,
        #[max_length = 255]
        name -> Varchar,
        #[max_length = 255]
        cuisine_type -> Varchar,
        opening_hours -> Time,
        closing_hours -> Time,
        #[max_length = 255]
        status -> Varchar,
        image -> Nullable<Bytea>,
    }
}

diesel::table! {
    ride_removal_proposals (proposal_id) {
        #[max_length = 255]
        proposal_id -> Varchar,
        #[max_length = 255]
        ride_id -> Varchar,
        #[max_length = 255]
        staff_id -> Varchar,
        #[max_length = 255]
        reason -> Varchar,
        created_at -> Nullable<Timestamp>,
    }
}

diesel::table! {
    ride_staffs (ride_id, staff_id) {
        #[max_length = 255]
        ride_id -> Varchar,
        #[max_length = 255]
        staff_id -> Varchar,
    }
}

diesel::table! {
    rides (ride_id) {
        #[max_length = 255]
        ride_id -> Varchar,
        #[max_length = 255]
        name -> Varchar,
        price -> Int4,
        opening_hours -> Time,
        closing_hours -> Time,
        #[max_length = 255]
        status -> Varchar,
        image -> Nullable<Bytea>,
    }
}

diesel::table! {
    souvenirs (souvenir_id) {
        #[max_length = 255]
        souvenir_id -> Varchar,
        #[max_length = 255]
        store_id -> Varchar,
        #[max_length = 255]
        name -> Varchar,
        #[max_length = 255]
        description -> Varchar,
        price -> Int4,
        image -> Nullable<Bytea>,
    }
}

diesel::table! {
    staffs (staff_id) {
        #[max_length = 255]
        staff_id -> Varchar,
        #[max_length = 255]
        name -> Varchar,
        #[max_length = 255]
        password -> Varchar,
        #[max_length = 255]
        role -> Varchar,
    }
}

diesel::table! {
    store_removal_proposals (proposal_id) {
        #[max_length = 255]
        proposal_id -> Varchar,
        #[max_length = 255]
        store_id -> Varchar,
        #[max_length = 255]
        staff_id -> Varchar,
        #[max_length = 255]
        reason -> Varchar,
        created_at -> Nullable<Timestamp>,
    }
}

diesel::table! {
    store_staffs (store_id, staff_id) {
        #[max_length = 255]
        store_id -> Varchar,
        #[max_length = 255]
        staff_id -> Varchar,
    }
}

diesel::table! {
    stores (store_id) {
        #[max_length = 255]
        store_id -> Varchar,
        #[max_length = 255]
        name -> Varchar,
        opening_hours -> Time,
        closing_hours -> Time,
        #[max_length = 255]
        status -> Varchar,
        image -> Nullable<Bytea>,
    }
}

diesel::joinable!(maintenances -> rides (ride_id));
diesel::joinable!(maintenances -> staffs (staff_id));
diesel::joinable!(menus -> restaurants (restaurant_id));
diesel::joinable!(new_ride_proposals -> staffs (staff_id));
diesel::joinable!(restaurant_staffs -> restaurants (restaurant_id));
diesel::joinable!(restaurant_staffs -> staffs (staff_id));
diesel::joinable!(ride_removal_proposals -> rides (ride_id));
diesel::joinable!(ride_removal_proposals -> staffs (staff_id));
diesel::joinable!(ride_staffs -> rides (ride_id));
diesel::joinable!(ride_staffs -> staffs (staff_id));
diesel::joinable!(souvenirs -> stores (store_id));
diesel::joinable!(store_removal_proposals -> staffs (staff_id));
diesel::joinable!(store_removal_proposals -> stores (store_id));
diesel::joinable!(store_staffs -> staffs (staff_id));
diesel::joinable!(store_staffs -> stores (store_id));

diesel::allow_tables_to_appear_in_same_query!(
    customers,
    lostandfounditems,
    maintenances,
    menus,
    new_ride_proposals,
    restaurant_staffs,
    restaurants,
    ride_removal_proposals,
    ride_staffs,
    rides,
    souvenirs,
    staffs,
    store_removal_proposals,
    store_staffs,
    stores,
);
