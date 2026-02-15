/**
 * YARNCOM - MODEL UNIT TESTS
 * Focus: The "Blueprint" validation and "Reading Time" math.
 * Final Polish Version for Submission
 */

const path = require('path');
// Force dotenv to look at the root folder specifically
require('dotenv').config({ path: path.resolve(__dirname, '../.env') }); 

const mongoose = require('mongoose');
const Blog = require('../src/models/blog.model');
jest.setTimeout(15000);// Increase timeout for database operations

beforeAll(async () => {
    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error("MONGO_URI undefined. Check .env path.");
    await mongoose.connect(uri);
});

afterAll(async () => {
    await Blog.deleteMany({});
    await mongoose.connection.close();
});

describe('Blog Model (The Data Blueprint)', () => {
    test('VALIDATION: Should fail if title is missing', async () => {
        const blog = new Blog({ body: "Content", author: new mongoose.Types.ObjectId() });
        let err;
        try { await blog.validate(); } catch (e) { err = e; }
        expect(err.errors.title).toBeDefined();
    });

    test('MATH: Should calculate 3 min for a 500-word post', async () => {
        const bodyText = "word ".repeat(500);
        const blog = new Blog({ 
            title: "Math Test " + Date.now(), 
            body: bodyText, 
            author: new mongoose.Types.ObjectId() 
        });
        
        // Save triggers the 'pre-save' hook automatically
        await blog.save();
        expect(blog.reading_time).toBe(3); 
    });
});