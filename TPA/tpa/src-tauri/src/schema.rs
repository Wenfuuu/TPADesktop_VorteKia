// @generated automatically by Diesel CLI.

diesel::table! {
    broadcasts (broadcast_id) {
        #[max_length = 255]
        broadcast_id -> Varchar,
        #[max_length = 255]
        message -> Varchar,
        #[max_length = 255]
        customer_id -> Nullable<Varchar>,
    }
}

diesel::table! {
    customers (customer_id) {
        #[max_length = 255]
        customer_id -> Varchar,
        #[max_length = 255]
        name -> Varchar,
        balance -> Int4,
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
    maintenance_logs (log_id) {
        #[max_length = 255]
        log_id -> Varchar,
        #[max_length = 255]
        staff_id -> Varchar,
        #[max_length = 255]
        report_id -> Nullable<Varchar>,
        #[max_length = 255]
        task_id -> Nullable<Varchar>,
        #[max_length = 255]
        status -> Varchar,
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
    new_restaurant_proposals (proposal_id) {
        #[max_length = 255]
        proposal_id -> Varchar,
        #[max_length = 255]
        staff_id -> Varchar,
        #[max_length = 255]
        restaurant_name -> Varchar,
        #[max_length = 255]
        description -> Varchar,
        #[max_length = 255]
        status -> Varchar,
        image -> Bytea,
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
        #[max_length = 255]
        status -> Varchar,
        image -> Bytea,
    }
}

diesel::table! {
    new_store_proposals (proposal_id) {
        #[max_length = 255]
        proposal_id -> Varchar,
        #[max_length = 255]
        staff_id -> Varchar,
        #[max_length = 255]
        store_name -> Varchar,
        #[max_length = 255]
        description -> Varchar,
        #[max_length = 255]
        status -> Varchar,
        image -> Bytea,
    }
}

diesel::table! {
    orders (order_id) {
        #[max_length = 255]
        order_id -> Varchar,
        #[max_length = 255]
        restaurant_id -> Varchar,
        #[max_length = 255]
        menu_id -> Varchar,
        #[max_length = 255]
        customer_id -> Varchar,
        #[max_length = 255]
        assigned_to -> Nullable<Varchar>,
        #[max_length = 255]
        status -> Varchar,
    }
}

diesel::table! {
    reports (report_id) {
        #[max_length = 255]
        report_id -> Varchar,
        #[max_length = 255]
        ride_id -> Varchar,
        #[max_length = 255]
        reported_by -> Varchar,
        #[max_length = 255]
        assigned_to -> Nullable<Varchar>,
        #[max_length = 255]
        reason -> Varchar,
        #[max_length = 255]
        status -> Varchar,
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
    restaurant_transactions (transaction_id) {
        #[max_length = 255]
        transaction_id -> Varchar,
        #[max_length = 255]
        customer_id -> Varchar,
        #[max_length = 255]
        restaurant_id -> Varchar,
        #[max_length = 255]
        menu_id -> Varchar,
        quantity -> Int4,
        total -> Int4,
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
    ride_queues (queue_id) {
        #[max_length = 255]
        queue_id -> Varchar,
        #[max_length = 255]
        ride_id -> Varchar,
        #[max_length = 255]
        customer_id -> Varchar,
        position -> Int4,
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
        #[max_length = 255]
        status -> Varchar,
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
    ride_transactions (transaction_id) {
        #[max_length = 255]
        transaction_id -> Varchar,
        #[max_length = 255]
        customer_id -> Varchar,
        #[max_length = 255]
        ride_id -> Varchar,
        amount -> Int4,
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
        #[max_length = 255]
        status -> Varchar,
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
    store_transactions (transaction_id) {
        #[max_length = 255]
        transaction_id -> Varchar,
        #[max_length = 255]
        customer_id -> Varchar,
        #[max_length = 255]
        store_id -> Varchar,
        #[max_length = 255]
        souvenir_id -> Varchar,
        quantity -> Int4,
        total -> Int4,
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

diesel::table! {
    tasks (task_id) {
        #[max_length = 255]
        task_id -> Varchar,
        #[max_length = 255]
        ride_id -> Varchar,
        #[max_length = 255]
        assigned_to -> Varchar,
        start_time -> Timestamp,
        end_time -> Timestamp,
        #[max_length = 255]
        status -> Varchar,
    }
}

diesel::joinable!(broadcasts -> customers (customer_id));
diesel::joinable!(maintenance_logs -> reports (report_id));
diesel::joinable!(maintenance_logs -> staffs (staff_id));
diesel::joinable!(maintenance_logs -> tasks (task_id));
diesel::joinable!(menus -> restaurants (restaurant_id));
diesel::joinable!(new_restaurant_proposals -> staffs (staff_id));
diesel::joinable!(new_ride_proposals -> staffs (staff_id));
diesel::joinable!(new_store_proposals -> staffs (staff_id));
diesel::joinable!(orders -> customers (customer_id));
diesel::joinable!(orders -> menus (menu_id));
diesel::joinable!(orders -> restaurants (restaurant_id));
diesel::joinable!(orders -> staffs (assigned_to));
diesel::joinable!(reports -> rides (ride_id));
diesel::joinable!(restaurant_staffs -> restaurants (restaurant_id));
diesel::joinable!(restaurant_staffs -> staffs (staff_id));
diesel::joinable!(restaurant_transactions -> customers (customer_id));
diesel::joinable!(restaurant_transactions -> restaurants (restaurant_id));
diesel::joinable!(ride_queues -> customers (customer_id));
diesel::joinable!(ride_queues -> rides (ride_id));
diesel::joinable!(ride_removal_proposals -> rides (ride_id));
diesel::joinable!(ride_removal_proposals -> staffs (staff_id));
diesel::joinable!(ride_staffs -> rides (ride_id));
diesel::joinable!(ride_staffs -> staffs (staff_id));
diesel::joinable!(ride_transactions -> customers (customer_id));
diesel::joinable!(ride_transactions -> rides (ride_id));
diesel::joinable!(souvenirs -> stores (store_id));
diesel::joinable!(store_removal_proposals -> staffs (staff_id));
diesel::joinable!(store_removal_proposals -> stores (store_id));
diesel::joinable!(store_staffs -> staffs (staff_id));
diesel::joinable!(store_staffs -> stores (store_id));
diesel::joinable!(store_transactions -> customers (customer_id));
diesel::joinable!(store_transactions -> souvenirs (souvenir_id));
diesel::joinable!(store_transactions -> stores (store_id));
diesel::joinable!(tasks -> rides (ride_id));
diesel::joinable!(tasks -> staffs (assigned_to));

diesel::allow_tables_to_appear_in_same_query!(
    broadcasts,
    customers,
    lostandfounditems,
    maintenance_logs,
    menus,
    new_restaurant_proposals,
    new_ride_proposals,
    new_store_proposals,
    orders,
    reports,
    restaurant_staffs,
    restaurant_transactions,
    restaurants,
    ride_queues,
    ride_removal_proposals,
    ride_staffs,
    ride_transactions,
    rides,
    souvenirs,
    staffs,
    store_removal_proposals,
    store_staffs,
    store_transactions,
    stores,
    tasks,
);
