/**
 * YARNCOM - EXPANDED AUTHENTICATION TESTS
 * Focus: Success, Failure, and Boundary (Edge) Cases.
 */

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/user.model');

jest.setTimeout(15000);

const testUser = {
    first_name: "Test",
    last_name: "Tester",
    email: "auth_test@yarncom.com",
    password: "password123"
};

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
    await User.deleteMany({ email: testUser.email });
});

afterAll(async () => {
    await User.deleteMany({ email: testUser.email });
    await mongoose.connection.close();
});

describe('Auth Controller - Final Polish', () => {
    test('SUCCESS: Should register a new member', async () => {
        const res = await request(app).post('/auth/signup').send(testUser);
        // Accept both API (201) and Web (302) responses
        expect([201, 302]).toContain(res.statusCode); 
    });

    test('FAILURE: Should block duplicates', async () => {
        const res = await request(app).post('/auth/signup').send(testUser);
        expect(res.text).toMatch(/exists/i);
    });

    test('SUCCESS: Should login and set cookie', async () => {
        const res = await request(app).post('/auth/login')
            .send({ email: testUser.email, password: testUser.password });
        expect(res.headers['set-cookie']).toBeDefined();
    });
});