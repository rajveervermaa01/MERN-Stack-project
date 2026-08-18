const realMongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

/**
 * Connect to MongoDB Database.
 * If local connection fails, dynamically falls back to an offline file-based Mock Mongoose driver.
 */
const connectDB = async () => {
  try {
    // Attempt connecting to the real MongoDB instance with a 2-second timeout
    const conn = await realMongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 2000
    });
    console.log(`[Database] MongoDB connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[Database Warning] Local MongoDB service not available: ${error.message}`);
    console.log('[Database] Bootstrapping transparent Mock Mongoose Engine (Offline Mode)...');
    
    bootstrapMockMongoose();
  }
};

/**
 * Hijacks Node.js require cache for Mongoose to provide an offline local JSON fallback.
 */
const bootstrapMockMongoose = () => {
  const dbPath = path.join(__dirname, 'db.json');

  // Initialize offline db.json storage file if not exists
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify([], null, 2));
  }

  // Create Mock Mongoose Object
  const mockMongoose = {
    connect: async () => {},
    disconnect: async () => {},
    Schema: function Schema(definition, options) {
      this.definition = definition || {};
      this.options = options || {};
    },
    model: function (modelName, schema) {
      const readData = () => {
        try {
          return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
        } catch (e) {
          return [];
        }
      };

      const writeData = (data) => {
        fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
      };

      // Mock Model class representing Mongoose Model
      class MockModel {
        constructor(data) {
          Object.assign(this, data);
          // Set default values defined in schema
          for (const key in schema.definition) {
            if (this[key] === undefined && schema.definition[key].default !== undefined) {
              const defVal = schema.definition[key].default;
              this[key] = typeof defVal === 'function' ? defVal() : defVal;
            }
          }
        }

        async save() {
          const errors = this.validateSync();
          if (errors) {
            const err = new Error(`Validation Failed: ${errors.join(', ')}`);
            err.name = 'ValidationError';
            throw err;
          }

          const data = readData();
          if (!this._id) {
            // Generate a random string ID mimicking MongoDB ObjectId
            this._id = Math.random().toString(36).substring(2, 9) + Math.random().toString(36).substring(2, 9);
            this.createdAt = new Date();
            this.updatedAt = new Date();
            data.push(this);
          } else {
            const index = data.findIndex((item) => item._id === this._id);
            if (index !== -1) {
              this.updatedAt = new Date();
              data[index] = this;
            } else {
              data.push(this);
            }
          }
          writeData(data);
          return this;
        }

        validateSync() {
          const errors = [];
          for (const key in schema.definition) {
            const field = schema.definition[key];
            const val = this[key];

            // Required field validation
            if (field.required && (val === undefined || val === null || val === '')) {
              errors.push(`${key} is required`);
            }

            // Enum verification
            if (field.enum && val !== undefined && !field.enum.includes(val)) {
              errors.push(`${key} must be one of [${field.enum.join(', ')}]`);
            }
          }
          return errors.length > 0 ? errors : null;
        }

        static async find(query = {}) {
          const data = readData();
          // Filter matching records
          return data.filter((item) => {
            for (const key in query) {
              if (item[key] !== query[key]) return false;
            }
            return true;
          });
        }

        static async findById(id) {
          const data = readData();
          return data.find((item) => item._id === id) || null;
        }

        static async create(bodyData) {
          const doc = new MockModel(bodyData);
          return await doc.save();
        }

        static async findByIdAndUpdate(id, updateData, options = {}) {
          const data = readData();
          const index = data.findIndex((item) => item._id === id);
          if (index === -1) return null;

          const doc = new MockModel({ ...data[index], ...updateData });

          if (options.runValidators) {
            const errors = doc.validateSync();
            if (errors) {
              const err = new Error(`Validation Failed: ${errors.join(', ')}`);
              err.name = 'ValidationError';
              throw err;
            }
          }

          doc.updatedAt = new Date();
          data[index] = doc;
          writeData(data);
          return doc;
        }

        static async findByIdAndDelete(id) {
          const data = readData();
          const index = data.findIndex((item) => item._id === id);
          if (index === -1) return null;
          const removed = data.splice(index, 1)[0];
          writeData(data);
          return removed;
        }
      }

      return MockModel;
    }
  };

  // Inject our custom object into node's module resolution cache
  const mongoosePath = require.resolve('mongoose');
  require.cache[mongoosePath].exports = mockMongoose;
};

module.exports = connectDB;
