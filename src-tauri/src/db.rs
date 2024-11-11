use serde::Deserialize;

#[derive(Deserialize)]
pub struct Task {
    pub id: String,
    pub title: String,
    pub description: Option<String>,
    pub document_id: Option<String>,
    pub priority: String,
    pub created_at: String,
    pub updated_at: String,
    pub column_id: String,
    pub deadline: Option<String>,
}

use rusqlite::{params, Connection, Result};

pub fn establish_connection() -> Result<Connection> {
    let conn = Connection::open("kanban.db")?;
    Ok(conn)
}

pub fn create_tables(conn: &Connection) -> Result<()> {
    conn.execute(
        "CREATE TABLE IF NOT EXISTS tasks (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            description TEXT,
            document_id TEXT,
            priority TEXT NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            column_id TEXT NOT NULL,
            deadline TEXT
        )",
        [],
    )?;
    Ok(())
}

pub fn insert_task(conn: &Connection, task: &Task) -> Result<()> {
    conn.execute(
        "INSERT INTO tasks (id, title, description, document_id, priority, created_at, updated_at, column_id, deadline)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)",
        params![
            task.id,
            task.title,
            task.description,
            task.document_id,
            task.priority,
            task.created_at,
            task.updated_at,
            task.column_id,
            task.deadline,
        ],
    )?;
    Ok(())
}
