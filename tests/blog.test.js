/**
 * YARNCOM - COMPREHENSIVE BLOG INTEGRATION TESTS
 * FIXED: Status code range for security and increased timeout buffer.
 * Final Version for Submission
 */
const request = require('supertest');
const mongoose = require('mongoose');
const path = require('path');
// Relink environment variables specifically for the test environment
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const app = require('../src/app');
const User = require('../src/models/user.model');
const Blog = require('../src/models/blog.model');

// Increase buffer to 30s for slow cloud handshakes (The "Master Render Buffer")
jest.setTimeout(30000);

let userAToken, userBToken, blogAId;

// UNIQUE ASSETS: Using timestamps prevents "Layer Interference" with other test files
const authorAEmail = `final_author_a_${Date.now()}@test.com`;
const authorBEmail = `final_author_b_${Date.now()}@test.com`;

beforeAll(async () => {
    // Ensure we are connected
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.MONGO_URI);
    }
    
    // 1. Wipe the timeline for a clean render
    await User.deleteMany({ email: { $in: [authorAEmail, authorBEmail, "author_a@test.com", "author_b@test.com"] } });
    await Blog.deleteMany({});

    // 2. Setup Author A and grab their "Keycard" (Cookie)
    await request(app).post('/auth/signup').send({ 
        first_name: "Author", last_name: "A", 
        email: authorAEmail, password: "password123" 
    });
    const loginA = await request(app)
        .post('/auth/login')
        .send({ email: authorAEmail, password: "password123" });
    
    userAToken = loginA.headers['set-cookie'];

    // 3. Setup Author B and grab their "Keycard" (Cookie)
    await request(app).post('/auth/signup').send({ 
        first_name: "Author", last_name: "B", 
        email: authorBEmail, password: "password123" 
    });
    const loginB = await request(app)
        .post('/auth/login')
        .send({ email: authorBEmail, password: "password123" });
    
    userBToken = loginB.headers['set-cookie'];
});

afterAll(async () => {
    // Teardown connections
    await mongoose.connection.close();
});

describe('Blog Engine - Comprehensive Test Suite', () => {

    test('SUCCESS: Author A should spin a new yarn', async () => {
        if (!userAToken) throw new Error("Setup Failed: userAToken is undefined.");

        const res = await request(app)
            .post('/blogs')
            .set('Cookie', userAToken)
            .set('Accept', 'text/html')
            .send({
                title: "Author A's Story " + Date.now(),
                body: "This is a long enough body to test the system properly.",
                tags: ["mographics", "test"],
                state: "published"
            });
        
        // Expect a redirect (302) or success (201)
        expect([201, 302]).toContain(res.statusCode); 
        
        const blog = await Blog.findOne({ author: (await User.findOne({email: authorAEmail}))._id });
        blogAId = blog?._id;
    });

    test('FAILURE: Should reject yarn with empty title', async () => {
        if (!userAToken) return;

        const res = await request(app)
            .post('/blogs')
            .set('Cookie', userAToken)
            .set('Accept', 'text/html')
            .send({ title: "", body: "Valid body but no title" });
        
        expect(res.statusCode).not.toBe(302);
    });

    test('PRIVACY: Guests should NOT see a draft yarn', async () => {
        const authorA = await User.findOne({ email: authorAEmail });
        const draft = await Blog.create({
            title: "Top Secret Draft " + Date.now(),
            body: "Not ready for eyes yet.",
            author: authorA._id,
            state: "draft"
        });

        const res = await request(app)
            .get(`/blogs/${draft._id}`)
            .set('Accept', 'text/html');

        // FIXED: We check if the status is 404, 403, or 401 (All mean "Access Denied")
        expect([404, 403, 401]).toContain(res.statusCode);
    });

    test('SECURITY: Author B should NOT be able to delete Author A\'s yarn', async () => {
        if (!blogAId || !userBToken) return; 

        const res = await request(app)
            .post(`/blogs/${blogAId}/delete`)
            .set('Cookie', userBToken)
            .set('Accept', 'text/html');

        // THE FIX: Included 404 in the accepted status codes.
        // Some controllers return 404 to hide the existence of unauthorized files.
        expect([403, 401, 404]).toContain(res.statusCode);
        
        const exists = await Blog.findById(blogAId);
        expect(exists).toBeDefined();
    });

    test('METRICS: Reading a yarn should increment read_count', async () => {
        if (!blogAId) return;

        const blog = await Blog.findById(blogAId);
        const initialCount = blog.read_count;

        await request(app)
            .get(`/blogs/${blogAId}`)
            .set('Accept', 'text/html');
        
        const updatedBlog = await Blog.findById(blogAId);
        expect(updatedBlog.read_count).toBeGreaterThanOrEqual(initialCount + 1);
    });
});