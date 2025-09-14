import psycopg2
import time
from psycopg2 import OperationalError

# Database connection parameters
DB_NAME = "neondb"
DB_USER = "neondb_owner"
DB_PASSWORD = "npg_Lua8NT6GBXKn"
DB_HOST = "ep-small-meadow-a26r579r-pooler.eu-central-1.aws.neon.tech"
DB_PORT = "5432"
def get_connection(max_retries=3, retry_delay=5):
    for attempt in range(max_retries):
        try:
            conn = psycopg2.connect(
                dbname=DB_NAME,
                user=DB_USER,
                password=DB_PASSWORD,
                host=DB_HOST,
                port=DB_PORT,
                connect_timeout=10
            )
            return conn
        except OperationalError as e:
            print(f"Connection attempt {attempt + 1} failed: {e}")
            if attempt < max_retries - 1:
                print(f"Retrying in {retry_delay} seconds...")
                time.sleep(retry_delay)
            else:
                raise

def create_tables():
    try:
        print("🔄 Creating missing tables...")
        
        # Connect to the database with retry logic
        conn = get_connection()
        cur = conn.cursor()

        # Add verification code columns to users table if they don't exist
        cur.execute("""
            DO $$
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                              WHERE table_name = 'Users' AND column_name = 'verification_code') THEN
                    ALTER TABLE "Users" ADD COLUMN verification_code VARCHAR(6);
                END IF;
                
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                              WHERE table_name = 'Users' AND column_name = 'verification_code_expires_at') THEN
                    ALTER TABLE "Users" ADD COLUMN verification_code_expires_at TIMESTAMP;
                END IF;
            END $$;
        """)
        print("✅ Added verification code columns to users table")

        # Create "FraudRules" table
        cur.execute("""
        CREATE TABLE IF NOT EXISTS "FraudRules" (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            description TEXT NOT NULL,
            rule_type VARCHAR(50) NOT NULL,
            threshold DECIMAL(15, 2),
            is_active BOOLEAN DEFAULT true,
            created_by INTEGER REFERENCES "Users"(id),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """)
        print("✅ Created FraudRules table")

        # Create "CustomerSupport" table
        cur.execute("""
        CREATE TABLE IF NOT EXISTS "CustomerSupport" (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES "Users"(id),
            subject VARCHAR(255) NOT NULL,
            message TEXT NOT NULL,
            status VARCHAR(50) NOT NULL DEFAULT 'open',
            assigned_to INTEGER REFERENCES "Users"(id),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """)
        print("✅ Created CustomerSupport table")

        # Create "Notifications" table
        cur.execute("""
        CREATE TABLE IF NOT EXISTS "Notifications" (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES "Users"(id),
            title VARCHAR(255) NOT NULL,
            message TEXT NOT NULL,
            type VARCHAR(50) NOT NULL,
            is_read BOOLEAN DEFAULT false,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """)
        print("✅ Created Notifications table")

        # Create "AuditLogs" table
        cur.execute("""
        CREATE TABLE IF NOT EXISTS "AuditLogs" (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES "Users"(id),
            action VARCHAR(100) NOT NULL,
            entity_type VARCHAR(50),
            entity_id INTEGER,
            details TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """)
        print("✅ Created AuditLogs table")

        # Commit changes
        conn.commit()
        print("✅ All tables created successfully!")

    except Exception as e:
        print(f"🔥 Error creating tables: {e}")
        if 'conn' in locals():
            conn.rollback()
    finally:
        if 'cur' in locals():
            cur.close()
        if 'conn' in locals():
            conn.close()

if __name__ == "__main__":
    create_tables() 
