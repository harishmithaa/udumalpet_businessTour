const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', 'backend', '.env') });

const connectDB = require('./config/db');
const User = require('./models/User');
const Blog = require('./models/Blog');

async function checkBlogsInDb() {
  console.log('--- STARTING BLOG DATABASE STATE CHECK ---');
  try {
    await connectDB();

    // 1. Query all blogs in the database
    const allBlogs = await Blog.find().populate('author', 'name email role');
    console.log(`\nFound total ${allBlogs.length} blogs in the database.`);
    
    allBlogs.forEach((blog, idx) => {
      console.log(`\nBlog #${idx + 1}:`);
      console.log(`- Title: "${blog.title}"`);
      console.log(`- Status: "${blog.status}"`);
      console.log(`- Author Name: "${blog.authorName}"`);
      console.log(`- Author ID: "${blog.author}"`);
      console.log(`- Created At: ${blog.createdAt}`);
    });

    // 2. Check if there are blogs that are 'Pending Approval'
    const pendingBlogs = allBlogs.filter(b => b.status === 'Pending Approval');
    console.log(`\nPending Approval blogs count: ${pendingBlogs.length}`);

    // 3. Test simulating a Blog.create with a missing or default authorName
    console.log('\nTesting validation parameters:');
    try {
      const tempUser = await User.findOne();
      console.log(`Using user: ${tempUser.fullName} (id: ${tempUser._id})`);
      
      const testBlog = new Blog({
        title: 'Validation Test Blog',
        content: 'Testing if this is successfully saved.',
        author: tempUser._id,
        // Wait, what if authorName is missing?
        authorName: tempUser.fullName || tempUser.name || 'Anonymous Author'
      });
      await testBlog.validate();
      console.log('- Mongoose validation passed for standard parameters.');
    } catch (valErr) {
      console.error('- Mongoose validation failed:', valErr.message);
    }

  } catch (err) {
    console.error('Error conducting check:', err.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

checkBlogsInDb();
