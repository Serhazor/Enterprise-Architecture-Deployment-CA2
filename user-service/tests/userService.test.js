const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const bcrypt = require('bcrypt');
const app = require('../index'); // Ensure this file exports your Express app

let mongoServer;

beforeAll(async () => {
    // Create and start instance of Mongo Memory Server
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
});

afterAll(async () => {
    // Disconnect mongoose and stop Mongo Memory Server
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('POST /users', () => {
    it('should create a new user and return 201 status', async () => {
        const userData = { name: 'John Doe', email: 'john@example.com', password: 'password123' };
        User.prototype.save = jest.fn().mockResolvedValue({
            _id: '123',
            name: 'John Doe',
            email: 'john@example.com'
        });

        const response = await request(app).post('/users').send(userData);
        expect(response.statusCode).toBe(201);
        expect(response.body.email).toBe('john@example.com');
        expect(response.body).not.toHaveProperty('password'); // Ensure password is not returned
    });

    it('should handle validation errors', async () => {
        User.prototype.save = jest.fn().mockImplementationOnce(() => {
            throw { name: 'ValidationError', message: 'Error: Validation failed' };
        });

        const response = await request(app).post('/users').send({ name: 'John' }); // Incomplete data
        expect(response.statusCode).toBe(400);
        expect(response.body.error).toContain('Validation failed');
    });
});

describe('POST /users/login', () => {
    it('should login successfully and return a success message', async () => {
        User.findOne = jest.fn().mockResolvedValue({
            _id: '123',
            email: 'john@example.com',
            password: await bcrypt.hash('password123', 10)
        });

        const response = await request(app).post('/users/login').send({
            email: 'john@example.com',
            password: 'password123'
        });
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Login successful');
    });

    it('should reject invalid credentials', async () => {
        User.findOne = jest.fn().mockResolvedValue({
            email: 'john@example.com',
            password: await bcrypt.hash('password123', 10)
        });

        const response = await request(app).post('/users/login').send({
            email: 'john@example.com',
            password: 'wrongpassword'
        });
        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe('Invalid credentials');
    });
});
