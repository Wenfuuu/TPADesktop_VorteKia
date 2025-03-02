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

diesel::joinable!(menus -> restaurants (restaurant_id));
diesel::joinable!(restaurant_staffs -> restaurants (restaurant_id));
diesel::joinable!(restaurant_staffs -> staffs (staff_id));
diesel::joinable!(souvenirs -> stores (store_id));

diesel::allow_tables_to_appear_in_same_query!(
    customers,
    lostandfounditems,
    menus,
    restaurant_staffs,
    restaurants,
    souvenirs,
    staffs,
    stores,
);
