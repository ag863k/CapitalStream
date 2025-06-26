-- CapitalStream Banking Dashboard Database Schema
-- PostgreSQL Database Setup

\c capitalstream;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE user_role AS ENUM ('CUSTOMER', 'ADMIN');
CREATE TYPE account_type AS ENUM ('CHECKING', 'SAVINGS', 'CREDIT');
CREATE TYPE transaction_type AS ENUM ('DEBIT', 'CREDIT', 'TRANSFER');
CREATE TYPE transaction_status AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'CANCELLED');

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role user_role DEFAULT 'CUSTOMER',
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    account_number VARCHAR(20) UNIQUE NOT NULL,
    account_type account_type NOT NULL,
    account_name VARCHAR(100) NOT NULL,
    balance DECIMAL(15,2) DEFAULT 0.00,
    currency VARCHAR(3) DEFAULT 'USD',
    is_active BOOLEAN DEFAULT true,
    credit_limit DECIMAL(15,2),
    interest_rate DECIMAL(5,4) DEFAULT 0.0000,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    from_account_id UUID REFERENCES accounts(id),
    to_account_id UUID REFERENCES accounts(id),
    transaction_type transaction_type NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    description VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    merchant VARCHAR(100),
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status transaction_status DEFAULT 'COMPLETED',
    reference_number VARCHAR(50) UNIQUE,
    balance_after DECIMAL(15,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_accounts_user_id ON accounts(user_id);
CREATE INDEX idx_accounts_account_number ON accounts(account_number);
CREATE INDEX idx_transactions_account_id ON transactions(account_id);
CREATE INDEX idx_transactions_date ON transactions(transaction_date);
CREATE INDEX idx_transactions_type ON transactions(transaction_type);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_reference ON transactions(reference_number);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_accounts_updated_at BEFORE UPDATE ON accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

INSERT INTO users (email, password, first_name, last_name, role) VALUES 
('admin@capitalstream.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj2JJW.M.F5a', 'Admin', 'User', 'ADMIN'),
('john.doe@email.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj2JJW.M.F5a', 'John', 'Doe', 'CUSTOMER');

DO $$
DECLARE
    customer_id UUID;
BEGIN
    SELECT id INTO customer_id FROM users WHERE email = 'john.doe@email.com';
    
    INSERT INTO accounts (user_id, account_number, account_type, account_name, balance) VALUES 
    (customer_id, 'CHK1234567890', 'CHECKING', 'Primary Checking', 5250.75),
    (customer_id, 'SAV1234567891', 'SAVINGS', 'Emergency Savings', 15000.00),
    (customer_id, 'CRE1234567892', 'CREDIT', 'Rewards Credit Card', -850.25);
    
    INSERT INTO transactions (account_id, transaction_type, amount, description, category, merchant, transaction_date, balance_after) 
    SELECT a.id, 'DEBIT', 125.50, 'Grocery Shopping', 'Food & Dining', 'Fresh Market', CURRENT_TIMESTAMP - INTERVAL '1 day', 5250.75
    FROM accounts a WHERE a.account_number = 'CHK1234567890'
    UNION ALL
    SELECT a.id, 'CREDIT', 2000.00, 'Salary Deposit', 'Income', 'ABC Company', CURRENT_TIMESTAMP - INTERVAL '2 days', 5376.25
    FROM accounts a WHERE a.account_number = 'CHK1234567890'
    UNION ALL
    SELECT a.id, 'DEBIT', 75.00, 'Gas Station', 'Transportation', 'Shell Gas', CURRENT_TIMESTAMP - INTERVAL '3 days', 3376.25
    FROM accounts a WHERE a.account_number = 'CHK1234567890'
    UNION ALL
    SELECT a.id, 'DEBIT', 1200.00, 'Rent Payment', 'Housing', 'Property Management', CURRENT_TIMESTAMP - INTERVAL '5 days', 3451.25
    FROM accounts a WHERE a.account_number = 'CHK1234567890'
    UNION ALL
    SELECT a.id, 'CREDIT', 500.00, 'Monthly Savings', 'Transfer', NULL, CURRENT_TIMESTAMP - INTERVAL '7 days', 15000.00
    FROM accounts a WHERE a.account_number = 'SAV1234567891'
    UNION ALL
    SELECT a.id, 'DEBIT', 45.99, 'Online Shopping', 'Shopping', 'Amazon', CURRENT_TIMESTAMP - INTERVAL '1 day', -850.25
    FROM accounts a WHERE a.account_number = 'CRE1234567892';
END $$;
