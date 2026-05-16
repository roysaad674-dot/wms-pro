const express = require('express');
const { runAsync, getAsync, allAsync } = require('./database');

const router = express.Router();

// ============ USERS ============
router.get('/users', async (req, res) => {
  try {
    const users = await allAsync('SELECT * FROM users');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/users', async (req, res) => {
  try {
    const { id, name, email, role } = req.body;
    await runAsync(
      `INSERT INTO users (id, name, email, role) VALUES (?, ?, ?, ?)`,
      [id, name, email, role]
    );
    res.json({ id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/users/:id', async (req, res) => {
  try {
    const { name, email, role } = req.body;
    await runAsync(
      `UPDATE users SET name=?, email=?, role=? WHERE id=?`,
      [name, email, role, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    await runAsync('DELETE FROM users WHERE id=?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ BUSINESS MANAGERS ============
router.get('/business-managers', async (req, res) => {
  try {
    const bms = await allAsync('SELECT * FROM business_managers');
    res.json(bms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/business-managers', async (req, res) => {
  try {
    const { id, name, bmId, adminEmail, country, status, profileId, createdAt, ownerId } = req.body;
    await runAsync(
      `INSERT INTO business_managers (id, name, bmId, adminEmail, country, status, profileId, createdAt, ownerId)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, name, bmId, adminEmail, country, status, profileId, createdAt, ownerId]
    );
    res.json({ id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/business-managers/:id', async (req, res) => {
  try {
    const { name, bmId, adminEmail, country, status, profileId, ownerId } = req.body;
    await runAsync(
      `UPDATE business_managers SET name=?, bmId=?, adminEmail=?, country=?, status=?, profileId=?, ownerId=? WHERE id=?`,
      [name, bmId, adminEmail, country, status, profileId, ownerId, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/business-managers/:id', async (req, res) => {
  try {
    await runAsync('DELETE FROM business_managers WHERE id=?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ AD ACCOUNTS ============
router.get('/ad-accounts', async (req, res) => {
  try {
    const accounts = await allAsync('SELECT * FROM ad_accounts');
    res.json(accounts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/ad-accounts', async (req, res) => {
  try {
    const { id, name, accountId, timezone, currency, status, dailySpendLimit, monthlySpend, businessManagerId, paymentMethodId, createdAt, ownerId } = req.body;
    await runAsync(
      `INSERT INTO ad_accounts (id, name, accountId, timezone, currency, status, dailySpendLimit, monthlySpend, businessManagerId, paymentMethodId, createdAt, ownerId)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, name, accountId, timezone, currency, status, dailySpendLimit, monthlySpend, businessManagerId, paymentMethodId, createdAt, ownerId]
    );
    res.json({ id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/ad-accounts/:id', async (req, res) => {
  try {
    const { name, accountId, timezone, currency, status, dailySpendLimit, monthlySpend, businessManagerId, paymentMethodId, ownerId } = req.body;
    await runAsync(
      `UPDATE ad_accounts SET name=?, accountId=?, timezone=?, currency=?, status=?, dailySpendLimit=?, monthlySpend=?, businessManagerId=?, paymentMethodId=?, ownerId=? WHERE id=?`,
      [name, accountId, timezone, currency, status, dailySpendLimit, monthlySpend, businessManagerId, paymentMethodId, ownerId, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/ad-accounts/:id', async (req, res) => {
  try {
    await runAsync('DELETE FROM ad_accounts WHERE id=?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ FACEBOOK PROFILES ============
router.get('/facebook-profiles', async (req, res) => {
  try {
    const profiles = await allAsync('SELECT * FROM facebook_profiles');
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/facebook-profiles', async (req, res) => {
  try {
    const { id, name, profileId, category, createdAt, ownerId } = req.body;
    await runAsync(
      `INSERT INTO facebook_profiles (id, name, profileId, category, createdAt, ownerId) VALUES (?, ?, ?, ?, ?, ?)`,
      [id, name, profileId, category, createdAt, ownerId]
    );
    res.json({ id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/facebook-profiles/:id', async (req, res) => {
  try {
    const { name, profileId, category, ownerId } = req.body;
    await runAsync(
      `UPDATE facebook_profiles SET name=?, profileId=?, category=?, ownerId=? WHERE id=?`,
      [name, profileId, category, ownerId, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/facebook-profiles/:id', async (req, res) => {
  try {
    await runAsync('DELETE FROM facebook_profiles WHERE id=?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ WALLET METHODS ============
router.get('/wallet-methods', async (req, res) => {
  try {
    const wallets = await allAsync('SELECT * FROM wallet_methods');
    res.json(wallets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/wallet-methods', async (req, res) => {
  try {
    const { id, label, type, last4, billingEmail, balance, currency, status, spendLimit, isDefault, addedAt, createdAt, ownerId } = req.body;
    await runAsync(
      `INSERT INTO wallet_methods (id, label, type, last4, billingEmail, balance, currency, status, spendLimit, isDefault, addedAt, createdAt, ownerId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, label, type, last4, billingEmail, balance, currency, status, spendLimit, isDefault, addedAt, createdAt, ownerId]
    );
    res.json({ id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/wallet-methods/:id', async (req, res) => {
  try {
    const { label, type, last4, billingEmail, balance, currency, status, spendLimit, isDefault, addedAt, ownerId } = req.body;
    await runAsync(
      `UPDATE wallet_methods SET label=?, type=?, last4=?, billingEmail=?, balance=?, currency=?, status=?, spendLimit=?, isDefault=?, addedAt=?, ownerId=? WHERE id=?`,
      [label, type, last4, billingEmail, balance, currency, status, spendLimit, isDefault, addedAt, ownerId, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/wallet-methods/:id', async (req, res) => {
  try {
    await runAsync('DELETE FROM wallet_methods WHERE id=?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ CAMPAIGNS ============
router.get('/campaigns', async (req, res) => {
  try {
    const campaigns = await allAsync('SELECT * FROM campaigns');
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/campaigns', async (req, res) => {
  try {
    const { id, name, adAccountId, status, objective, budget, spend, reach, impressions, clicks, conversions, createdAt, ownerId } = req.body;
    await runAsync(
      `INSERT INTO campaigns (id, name, adAccountId, status, objective, budget, spend, reach, impressions, clicks, conversions, createdAt, ownerId)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, name, adAccountId, status, objective, budget, spend, reach, impressions, clicks, conversions, createdAt, ownerId]
    );
    res.json({ id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/campaigns/:id', async (req, res) => {
  try {
    const { name, adAccountId, status, objective, budget, spend, reach, impressions, clicks, conversions, ownerId } = req.body;
    await runAsync(
      `UPDATE campaigns SET name=?, adAccountId=?, status=?, objective=?, budget=?, spend=?, reach=?, impressions=?, clicks=?, conversions=?, ownerId=? WHERE id=?`,
      [name, adAccountId, status, objective, budget, spend, reach, impressions, clicks, conversions, ownerId, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/campaigns/:id', async (req, res) => {
  try {
    await runAsync('DELETE FROM campaigns WHERE id=?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============ DAILY DATA ============
router.get('/daily-data', async (req, res) => {
  try {
    const data = await allAsync('SELECT * FROM daily_data');
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/daily-data', async (req, res) => {
  try {
    const { id, campaignId, date, spend, reach, impressions, clicks, conversions, ctr, cpc, createdAt, ownerId } = req.body;
    await runAsync(
      `INSERT INTO daily_data (id, campaignId, date, spend, reach, impressions, clicks, conversions, ctr, cpc, createdAt, ownerId)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, campaignId, date, spend, reach, impressions, clicks, conversions, ctr, cpc, createdAt, ownerId]
    );
    res.json({ id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/daily-data/:id', async (req, res) => {
  try {
    const { campaignId, date, spend, reach, impressions, clicks, conversions, ctr, cpc, ownerId } = req.body;
    await runAsync(
      `UPDATE daily_data SET campaignId=?, date=?, spend=?, reach=?, impressions=?, clicks=?, conversions=?, ctr=?, cpc=?, ownerId=? WHERE id=?`,
      [campaignId, date, spend, reach, impressions, clicks, conversions, ctr, cpc, ownerId, req.params.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/daily-data/:id', async (req, res) => {
  try {
    await runAsync('DELETE FROM daily_data WHERE id=?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
