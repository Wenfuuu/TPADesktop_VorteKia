// @generated automatically by Diesel CLI.

diesel::table! {
    customers (customer_id) {
        #[max_length = 100]
        customer_id -> Varchar,
        #[max_length = 50]
        name -> Varchar,
    }
}

diesel::table! {
    lostandfounditems (item_id) {
        #[max_length = 50]
        item_id -> Varchar,
        #[max_length = 50]
        name -> Varchar,
        #[max_length = 50]
        item_type -> Varchar,
        #[max_length = 50]
        color -> Varchar,
        #[max_length = 50]
        last_seen_location -> Varchar,
        #[max_length = 50]
        found_location -> Nullable<Varchar>,
        #[max_length = 50]
        owner -> Varchar,
        #[max_length = 50]
        finder -> Nullable<Varchar>,
        #[max_length = 50]
        status -> Varchar,
        image -> Nullable<Bytea>,
    }
}

diesel::table! {
    staffs (staff_id) {
        #[max_length = 100]
        staff_id -> Varchar,
        #[max_length = 50]
        name -> Varchar,
        #[max_length = 100]
        password -> Varchar,
        #[max_length = 50]
        role -> Varchar,
    }
}

diesel::allow_tables_to_appear_in_same_query!(
    customers,
    lostandfounditems,
    staffs,
);
