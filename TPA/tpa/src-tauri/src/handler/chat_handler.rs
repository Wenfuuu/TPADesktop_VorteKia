use serde::{Deserialize, Serialize};
use tauri::State;
use reqwest::Client;
use chrono::Utc;
use tokio::sync::Mutex as AsyncMutex;

// Define Firebase Auth credentials
#[derive(Clone, Serialize, Deserialize, Debug)]
pub struct FirebaseConfig {
    api_key: String,
    project_id: String,
}

// Define message structure
#[derive(Clone, Serialize, Deserialize, Debug)]
pub struct ChatMessage {
    pub id: Option<String>,
    pub text: String,
    pub created_at: i64,
    pub staff_id: String,
    pub name: String,
    pub role: String,
    pub avatar_initials: String,
}

// Firebase client state to be managed by Tauri
pub struct FirebaseClient(pub AsyncMutex<Client>); // Use `tokio::sync::Mutex` for async operations

// Initialize Firebase client
pub fn init_firebase_client() -> FirebaseClient {
    FirebaseClient(AsyncMutex::new(Client::new()))
}

// Get Firebase configuration
fn get_firebase_config() -> FirebaseConfig {
    FirebaseConfig {
        api_key: "AIzaSyAP3RN9n1ZItVe4wCCcdodT9YKJCVhw7mE".to_string(),
        project_id: "tpadesktop-f18b5".to_string(),
    }
}

// Firebase REST API endpoints
fn get_firestore_base_url() -> String {
    let config = get_firebase_config();
    format!("https://firestore.googleapis.com/v1/projects/{}/databases/(default)/documents", config.project_id)
}

// Send a message to Firestore
#[tauri::command]
pub async fn send_chat_message(
    firebase: State<'_, FirebaseClient>,
    chatgroup: &str, 
    message: &str, 
    staff_id: &str,
    name: &str,
    role: &str
) -> Result<String, String> {
    let client = firebase.0.lock().await.clone();
    let base_url = get_firestore_base_url();
    let url = format!("{}/staffChats/{}/messages", base_url, chatgroup); // Removed `?documentId=auto`
    // println!("{}", url);

    let avatar_initials = name
        .split_whitespace()
        .map(|n| n.chars().next().unwrap_or(' '))
        .collect::<String>()
        .to_uppercase();

    let timestamp = Utc::now().to_rfc3339(); // Corrected to RFC 3339 format

    // Create Firestore document structure
    let document = serde_json::json!({
        "fields": {
            "text": { "stringValue": message },
            "createdAt": { "timestampValue": timestamp }, // Fixed timestamp format
            "staff_id": { "stringValue": staff_id },
            "name": { "stringValue": name },
            "role": { "stringValue": role },
            "avatarInitials": { "stringValue": avatar_initials }
        }
    });

    // Send request to Firestore
    match client.post(&url).json(&document).send().await {
        Ok(response) => {
            let status = response.status();
            let body = response.text().await.unwrap_or_default();
            if status.is_success() {
                Ok("Message sent successfully".to_string())
            } else {
                Err(format!("Failed to send message: {} - {}", status, body))
            }
        },
        Err(e) => Err(format!("Error sending message: {}", e)),
    }
}

// Get messages from a chat group
#[tauri::command]
pub async fn get_chat_messages(
    firebase: State<'_, FirebaseClient>,
    chatgroup: &str,
    limit: u32
) -> Result<Vec<ChatMessage>, String> {
    let client = firebase.0.lock().await.clone();
    let base_url = get_firestore_base_url();
    let url = format!("{}/staffChats/{}/:runQuery", base_url, chatgroup); // FIXED URL
    // println!("{}", url);

    let query = serde_json::json!({
        "structuredQuery": {
            "from": [{ "collectionId": "messages" }], // Query inside the "messages" subcollection
            "orderBy": [{
                "field": { "fieldPath": "createdAt" },
                "direction": "ASCENDING"
            }],
            "limit": limit
        }
    });

    // Send request to Firestore
    match client.post(&url).json(&query).send().await {
        Ok(response) => {
            let status = response.status();
            let body = response.text().await.unwrap_or_default();

            if status.is_success() {
                match serde_json::from_str::<serde_json::Value>(&body) {
                    Ok(data) => {
                        let empty_vec = vec![];
                        let documents = data.as_array().unwrap_or(&empty_vec);
                        let mut messages = Vec::new();

                        for doc in documents {
                            if let Some(document) = doc["document"].as_object() {
                                let name = document["name"]
                                    .as_str()
                                    .unwrap_or("")
                                    .split('/')
                                    .last()
                                    .unwrap_or("")
                                    .to_string();

                                // Store fields object in a variable first
                                let empty_map = serde_json::Map::new();
                                let fields = document.get("fields").and_then(|f| f.as_object()).unwrap_or(&empty_map);

                                let text = fields.get("text")
                                    .and_then(|v| v["stringValue"].as_str())
                                    .unwrap_or("")
                                    .to_string();

                                let created_at = fields.get("createdAt")
                                    .and_then(|v| v["timestampValue"].as_str())
                                    .map(|ts| chrono::DateTime::parse_from_rfc3339(ts)
                                        .unwrap_or_default()
                                        .timestamp())
                                    .unwrap_or(0);

                                let staff_id = fields.get("staff_id")
                                    .and_then(|v| v["stringValue"].as_str())
                                    .unwrap_or("")
                                    .to_string();

                                let staff_name = fields.get("name")
                                    .and_then(|v| v["stringValue"].as_str())
                                    .unwrap_or("")
                                    .to_string();

                                let role = fields.get("role")
                                    .and_then(|v| v["stringValue"].as_str())
                                    .unwrap_or("")
                                    .to_string();

                                let avatar_initials = fields.get("avatarInitials")
                                    .and_then(|v| v["stringValue"].as_str())
                                    .unwrap_or("")
                                    .to_string();

                                messages.push(ChatMessage {
                                    id: Some(name),
                                    text,
                                    created_at,
                                    staff_id,
                                    name: staff_name,
                                    role,
                                    avatar_initials,
                                });
                            }
                        }

                        Ok(messages)
                    }
                    Err(e) => Err(format!("Error parsing response: {}", e)),
                }
            } else {
                Err(format!("Failed to get messages: {} - {}", status, body))
            }
        }
        Err(e) => Err(format!("Error getting messages: {}", e)),
    }
}
