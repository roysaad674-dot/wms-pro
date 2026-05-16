const mysql = require('mysql2/promise');

let pool;

const initializeDatabase = async () => {
  pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'facebook_ads_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  const connection = await pool.getConnection();

  try {
    // Users table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        role VARCHAR(100) NOT NULL
      )
    `);

    // Business Managers table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS business_managers (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        bmId VARCHAR(255) NOT NULL,
        adminEmail VARCHAR(255),
        country VARCHAR(100),
        status VARCHAR(50),
        profileId VARCHAR(255),
        createdAt VARCHAR(50),
        ownerId VARCHAR(255)
      )
    `);

    // Ad Accounts table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS ad_accounts (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        accountId VARCHAR(255) NOT NULL,
        timezone VARCHAR(100),
        currency VARCHAR(10),
        status VARCHAR(50),
        dailySpendLimit DECIMAL(10, 2),
        monthlySpend DECIMAL(10, 2),
        businessManagerId VARCHAR(255),
        paymentMethodId VARCHAR(255),
        createdAt VARCHAR(50),
        ownerId VARCHAR(255)
      )
    `);

    // Facebook Profiles table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS facebook_profiles (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        profileId VARCHAR(255) NOT NULL,
        category VARCHAR(100),
        createdAt VARCHAR(50),
        ownerId VARCHAR(255)
      )
    `);

    // Wallet Methods table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS wallet_methods (
        id VARCHAR(255) PRIMARY KEY,
        label VARCHAR(255) NOT NULL,
        type VARCHAR(100),
        last4 VARCHAR(4),
        billingEmail VARCHAR(255),
        balance DECIMAL(10, 2),
        currency VARCHAR(10),
        status VARCHAR(50),
        spendLimit DECIMAL(10, 2),
        isDefault BOOLEAN DEFAULT FALSE,
        addedAt VARCHAR(50),
        createdAt VARCHAR(50),
        ownerId VARCHAR(255)
      )
    `);

    // Campaigns table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS campaigns (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        adAccountId VARCHAR(255) NOT NULL,
        status VARCHAR(50),
        objective VARCHAR(100),
        budget DECIMAL(10, 2),
        spend DECIMAL(10, 2),
        reach INT,
        impressions INT,
        clicks INT,
        conversions INT,
        createdAt VARCHAR(50),
        ownerId VARCHAR(255)
      )
    `);

    // Daily Data table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS daily_data (
        id VARCHAR(255) PRIMARY KEY,
        campaignId VARCHAR(255) NOT NULL,
        date VARCHAR(50),
        spend DECIMAL(10, 2),
        reach INT,
        impressions INT,
        clicks INT,
        conversions INT,
        ctr DECIMAL(5, 2),
        cpc DECIMAL(10, 2),
        createdAt VARCHAR(50),
        ownerId VARCHAR(255)
      )
    `);

    console.log('MySQL Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    connection.release();
  }
};

const runAsync = async (sql, params = []) => {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.execute(sql, params);
    return result;
  } finally {
    connection.release();
  }
};

const getAsync = async (sql, params = []) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute(sql, params);
    return rows[0];
  } finally {
    connection.release();
  }
};

const allAsync = async (sql, params = []) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute(sql, params);
    return rows;
  } finally {
    connection.release();
  }
};

module.exports = {
  initializeDatabase,
  runAsync,
  getAsync,
  allAsync
};
