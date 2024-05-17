//! Backend SQLite database handlers for persisting documents.

use std::str::FromStr;

use anyhow::{bail, Result};
use sqlx::ConnectOptions;
use sqlx::postgres::PgPoolOptions;
use sqlx::sqlite::SqliteConnectOptions;
use sqlx::SqlitePool;
use sqlx::{Pool, Postgres, Sqlite};

/// Represents a document persisted in database storage.
#[derive(sqlx::FromRow, PartialEq, Eq, Clone, Debug)]
pub struct PersistedDocument {
    /// Text content of the document.
    pub text: String,
    /// Language of the document for editor syntax highlighting.
    pub language: Option<String>,
}

/// DatabasePool is an enum that can be either Postgres or Sqlite.
#[derive(Clone, Debug)]
pub enum DatabasePool {
    /// Postgesql Pool
    Postgres(Pool<Postgres>),
    /// Sqlite Pool
    Sqlite(Pool<Sqlite>),
}

/// A driver for database operations wrapping a pool connection.
#[derive(Clone, Debug)]
pub struct Database {
    pool: DatabasePool,
}

impl Database {
    /// Construct a new database from Postgres connection URI.
    pub async fn new(uri: &str) -> Result<Self> {
        let pool = match uri {
            uri if uri.starts_with("postgres://") => {
                let pool = PgPoolOptions::new().connect(uri).await?;

                // Run migrations
                sqlx::migrate!().run(&pool).await?;

                DatabasePool::Postgres(pool)
            }
            uri if uri.starts_with("sqlite://") => {
                // Create database file if missing, and run migrations.
                let mut conn = SqliteConnectOptions::from_str(uri)?
                    .create_if_missing(true)
                    .connect()
                    .await?;
                sqlx::migrate!().run(&mut conn).await?;

                DatabasePool::Sqlite(SqlitePool::connect(uri).await?)
            }
            _ => {
                return Err(anyhow::anyhow!("Unsupported database type in URI"));
            }
        };

        Ok(Database { pool })
    }

    /// Load the text of a document from the database.
    pub async fn load(&self, document_id: &str) -> Result<PersistedDocument> {
        match &self.pool {
            DatabasePool::Postgres(pool) => {
                sqlx::query_as(r#"SELECT text, language FROM document WHERE id = $1"#)
                    .bind(document_id)
                    .fetch_one(pool)
                    .await
                    .map_err(|e| e.into())
            }
            DatabasePool::Sqlite(pool) => {
                sqlx::query_as(r#"SELECT text, language FROM document WHERE id = $1"#)
                    .bind(document_id)
                    .fetch_one(pool)
                    .await
                    .map_err(|e| e.into())
            }
        }
    }

    /// Store the text of a document in the database.
    pub async fn store(&self, document_id: &str, document: &PersistedDocument) -> Result<()> {
        match &self.pool {
            DatabasePool::Postgres(pool) => {
                let result = sqlx::query(
                    r#"
        INSERT INTO
            document (id, text, language)
        VALUES
            ($1, $2, $3)
        ON CONFLICT(id) DO UPDATE SET
            text = excluded.text,
            language = excluded.language"#,
                )
                .bind(document_id)
                .bind(&document.text)
                .bind(&document.language)
                .execute(pool)
                .await?;
                if result.rows_affected() != 1 {
                    bail!(
                        "expected store() to receive 1 row affected, but it affected {} rows instead",
                        result.rows_affected(),
                    );
                }
                Ok(())
            }
            DatabasePool::Sqlite(pool) => {
                let result = sqlx::query(
                    r#"
        INSERT INTO
            document (id, text, language)
        VALUES
            ($1, $2, $3)
        ON CONFLICT(id) DO UPDATE SET
            text = excluded.text,
            language = excluded.language"#,
                )
                .bind(document_id)
                .bind(&document.text)
                .bind(&document.language)
                .execute(pool)
                .await?;
                if result.rows_affected() != 1 {
                    bail!(
                        "expected store() to receive 1 row affected, but it affected {} rows instead",
                        result.rows_affected(),
                    );
                }
                Ok(())
            }
        }
    }

    /// Count the number of documents in the database.
    pub async fn count(&self) -> Result<usize> {
        match &self.pool {
            DatabasePool::Postgres(pool) => {
                let row: (i64,) = sqlx::query_as("SELECT count(*) FROM document")
                    .fetch_one(pool)
                    .await?;
                Ok(row.0 as usize)
            }
            DatabasePool::Sqlite(pool) => {
                let row: (i64,) = sqlx::query_as("SELECT count(*) FROM document")
                    .fetch_one(pool)
                    .await?;
                Ok(row.0 as usize)
            }
        }
    }
}
