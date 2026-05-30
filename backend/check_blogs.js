const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const Blog = require('./models/Blog');
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/udtbusiness';

async function check() {
  try {
    await mongoose.connect(mongoUri);
    const blogs = await Blog.find({}, 'title coverImage thumbnail status author authorName revisionSuggestions');
    console.log('\n--- Blogs in Database ---');
    blogs.forEach(b => {
      console.log(`- Title: "${b.title}"`);
      console.log(`  CoverImage: "${b.coverImage}"`);
      console.log(`  Thumbnail: "${b.thumbnail}"`);
      console.log(`  Status: "${b.status}"`);
      console.log(`  AuthorName: "${b.authorName}"`);
      console.log(`  RevisionSuggestions: "${b.revisionSuggestions}"`);
    });
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

check();
