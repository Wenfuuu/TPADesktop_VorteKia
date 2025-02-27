use std::sync::Mutex;

use super::{customer::Customer, staff::Staff};

pub struct CurrentUser{
    pub customer: Mutex<Option<Customer>>,
    pub staff: Mutex<Option<Staff>>
}