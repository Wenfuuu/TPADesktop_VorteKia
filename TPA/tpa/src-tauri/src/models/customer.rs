use serde::{Serialize, Deserialize};
use crate::schema::customers;
use diesel::prelude::*;

#[derive(Debug, Queryable, Insertable, AsChangeset, Serialize, Deserialize, Clone)]
#[diesel(table_name = customers)]
pub struct Customer{
    pub customer_id: String,
    pub name: String
}

// impl From<Customer> for User{
//     fn from(customer: Customer) -> Self{
//         User{
//             id: customer.customer_id,
//             name: customer.name
//         }
//     }
// }