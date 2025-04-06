use crate::models::review::Review;
use crate::db::establish_connection;
use crate::diesel::prelude::*;
use uuid::Uuid;

#[tauri::command]
pub fn submit_review(
    reviewtext: &str, 
    customerid: &str,
    placeid: &str
) -> Result<bool, String> {
    println!("submitting review {}", reviewtext);
    use crate::schema::reviews::dsl::*;
    let conn = &mut establish_connection();

    let new_review = Review {
        review_id: format!("REVIEW-{}", &Uuid::new_v4().to_string()[..8]),
        customer_id: customerid.to_string(),
        place_id: placeid.to_string(),
        review: reviewtext.to_string()
    };

    diesel::insert_into(reviews)
        .values(&new_review)
        .execute(conn)
        .map(|_| true)
        .map_err(|err| format!("Database error: {}", err))
}