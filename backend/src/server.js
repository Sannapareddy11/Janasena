const dotenv = require('dotenv');
// Load environment variables
dotenv.config();

const app = require('./app');
const connectDB = require('./config/db');
const Admin = require('./models/adminModel');
const { initFirebase } = require('./config/firebase');

const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB().then(() => {
  initFirebase();
  // Seed admin and start server
  seedAdmin().then(() => {
    app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  });
});

// Seed admin user helper
async function seedAdmin() {
  try {
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      const defaultEmail = 'admin@newshub.com';
      const defaultPassword = 'AdminPassword123!';
      
      const admin = new Admin({
        name: 'System Admin',
        email: defaultEmail,
        password: defaultPassword, // pre-save hook hashes this
        role: 'admin',
      });
      
      await admin.save();
      console.log('==================================================');
      console.log('DEMO ADMIN SEEDED SUCCESSFULLY');
      console.log(`Email:    ${defaultEmail}`);
      console.log(`Password: ${defaultPassword}`);
      console.log('==================================================');
    } else {
      console.log('Database already contains admin account(s). Skipping seed.');
    }
  } catch (error) {
    console.error('Error seeding default admin account:', error.message);
  }
}
