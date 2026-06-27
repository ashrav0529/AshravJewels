const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ashrav_jewels';

let isUsingMongoDB = false;
let dbModels = {};

// Ensure local data directory exists for JSON fallback
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// =========================================================================
// MONGODB SCHEMAS AND MODELS (REAL MONGOOSE)
// =========================================================================

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  stock: { type: Number, required: true, default: 10 },
  image: { type: String, required: true },
  specifications: {
    metal: { type: String },
    stone: { type: String },
    purity: { type: String },
    weight: { type: String }
  },
  createdAt: { type: Date, default: Date.now }
});

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: [{
    productId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    image: { type: String }
  }],
  totalAmount: { type: Number, required: true },
  shippingAddress: {
    fullName: { type: String, required: true },
    addressLine1: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    phone: { type: String, required: true }
  },
  paymentMethod: { type: String, default: 'Credit Card' },
  status: { type: String, default: 'Processing' },
  createdAt: { type: Date, default: Date.now }
});

// =========================================================================
// JSON FILE-BASED DATABASE FALLBACK ENGINE
// =========================================================================

function getJsonFilePath(collectionName) {
  return path.join(dataDir, `${collectionName}.json`);
}

function readJsonFile(collectionName) {
  const filePath = getJsonFilePath(collectionName);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([]));
  }
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}

function writeJsonFile(collectionName, data) {
  const filePath = getJsonFilePath(collectionName);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

class MockModel {
  constructor(collectionName, data = {}) {
    this._collectionName = collectionName;
    Object.assign(this, data);
  }

  async save() {
    const collName = this._collectionName;
    const items = readJsonFile(collName);
    // Build a clean plain object without internal properties
    const record = this._toPlainObject();
    if (!this._id) {
      this._id = 'mock_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
      this.createdAt = new Date().toISOString();
      record._id = this._id;
      record.createdAt = this.createdAt;
      items.push(record);
    } else {
      const idx = items.findIndex(item => item._id === this._id);
      const updated = this._toPlainObject();
      if (idx !== -1) {
        items[idx] = updated;
      } else {
        items.push(updated);
      }
    }
    writeJsonFile(collName, items);
    return this;
  }

  _toPlainObject() {
    // Returns a clean copy without internal class properties
    const internal = new Set(['_collectionName']);
    const plain = {};
    for (const key of Object.keys(this)) {
      if (!internal.has(key)) plain[key] = this[key];
    }
    return plain;
  }

  static _getCollectionName() {
    // Falls back to the class name as lowercase plural (e.g. 'users', 'products', 'orders')
    return this.name.toLowerCase() + 's';
  }

  static async find(query = {}) {
    const items = readJsonFile(this._getCollectionName());
    return items.filter(item => {
      for (let key in query) {
        const qVal = typeof query[key] === 'string' ? query[key].toLowerCase() : query[key];
        const iVal = typeof item[key] === 'string' ? item[key].toLowerCase() : item[key];
        if (qVal !== iVal) return false;
      }
      return true;
    });
  }

  static async findOne(query = {}) {
    const items = readJsonFile(this._getCollectionName());
    const found = items.find(item => {
      for (let key in query) {
        const qVal = typeof query[key] === 'string' ? query[key].toLowerCase() : query[key];
        const iVal = typeof item[key] === 'string' ? item[key].toLowerCase() : item[key];
        if (qVal !== iVal) return false;
      }
      return true;
    });
    return found ? new this(found) : null;
  }

  static async findById(id) {
    const items = readJsonFile(this._getCollectionName());
    const found = items.find(item => item._id === id);
    return found ? new this(found) : null;
  }

  static async create(data) {
    if (Array.isArray(data)) {
      return this.insertMany(data);
    }
    const instance = new this(data);
    return await instance.save();
  }

  static async insertMany(array) {
    const collection = this._getCollectionName();
    const items = readJsonFile(collection);
    const saved = [];
    for (let data of array) {
      const instance = new this(data);
      instance._id = 'mock_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
      instance.createdAt = new Date().toISOString();
      const record = instance._toPlainObject();
      items.push(record);
      saved.push(instance);
    }
    writeJsonFile(collection, items);
    return saved;
  }

  static async deleteMany(query = {}) {
    const collection = this._getCollectionName();
    if (Object.keys(query).length === 0) {
      writeJsonFile(collection, []);
      return { deletedCount: 0 };
    }
    const items = readJsonFile(collection);
    const filtered = items.filter(item => {
      for (let key in query) {
        if (query[key] === item[key]) return false;
      }
      return true;
    });
    writeJsonFile(collection, filtered);
    return { deletedCount: items.length - filtered.length };
  }
}

class User extends MockModel {
  constructor(data) {
    super('users', data);
  }
}

class Product extends MockModel {
  constructor(data) {
    super('products', data);
  }
}

class Order extends MockModel {
  constructor(data) {
    super('orders', data);
  }
}

// =========================================================================
// DATABASE INITIALIZER & EXPORTS
// =========================================================================

const connectDB = async () => {
  try {
    console.log(`Connecting to MongoDB at ${MONGODB_URI}...`);
    // Connect with a short timeout so fallback triggers quickly if MongoDB is offline
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 3000, 
    });
    isUsingMongoDB = true;
    console.log('MongoDB Connected Successfully.');
    
    dbModels.User = mongoose.model('User', userSchema);
    dbModels.Product = mongoose.model('Product', productSchema);
    dbModels.Order = mongoose.model('Order', orderSchema);
  } catch (err) {
    isUsingMongoDB = false;
    console.warn('===============================================================');
    console.warn('WARNING: Failed to connect to MongoDB.');
    console.warn('Reason:', err.message);
    console.warn('Activating local JSON database fallback engine.');
    console.warn('The application is fully functional. Data will be saved in ./data/');
    console.warn('===============================================================');
    
    dbModels.User = User;
    dbModels.Product = Product;
    dbModels.Order = Order;
  }
};

module.exports = {
  connectDB,
  getModels: () => dbModels,
  isUsingMongoDB: () => isUsingMongoDB
};
