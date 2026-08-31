const { expect } = require('chai');
const request = require('supertest');
const sinon = require('sinon');
const app = require('../app');
const authService = require('../services/auth.service');
const User = require('../models/user.model');
const { AppError, BadRequestError, UnauthorizedError, ConflictError } = require('../utils/errors');

describe('Auth Module Unit Tests', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('Auth Service Logic', () => {
    it('should generate a valid JWT token', () => {
      const token = authService.generateToken('user123');
      expect(token).to.be.a('string');
      expect(token.length).to.be.greaterThan(20);
    });

    it('should throw BadRequestError if registration fields are missing', async () => {
      try {
        await authService.registerUser({ name: '', email: 'test@example.com', password: '' });
        expect.fail('Should have thrown error');
      } catch (err) {
        expect(err).to.be.an.instanceOf(BadRequestError);
      }
    });

    it('should throw ConflictError if email is already registered', async () => {
      sinon.stub(User, 'findOne').resolves({ _id: '123', email: 'existing@example.com' });

      try {
        await authService.registerUser({ name: 'Aryan', email: 'existing@example.com', password: 'password123' });
        expect.fail('Should have thrown error');
      } catch (err) {
        expect(err).to.be.an.instanceOf(ConflictError);
        expect(err.message).to.include('already exists');
      }
    });

    it('should register a new user successfully', async () => {
      sinon.stub(User, 'findOne').resolves(null);
      const fakeCreatedUser = {
        _id: '507f1f77bcf86cd799439011',
        name: 'Aryan Mirza',
        email: 'aryan@example.com',
        createdAt: new Date()
      };
      sinon.stub(User, 'create').resolves(fakeCreatedUser);

      const result = await authService.registerUser({
        name: 'Aryan Mirza',
        email: 'aryan@example.com',
        password: 'password123'
      });

      expect(result).to.have.property('user');
      expect(result).to.have.property('token');
      expect(result.user.email).to.equal('aryan@example.com');
    });

    it('should throw BadRequestError if login fields are missing', async () => {
      try {
        await authService.loginUser({ email: '', password: '' });
        expect.fail('Should have thrown error');
      } catch (err) {
        expect(err).to.be.an.instanceOf(BadRequestError);
      }
    });

    it('should throw UnauthorizedError if user does not exist on login', async () => {
      const chainable = {
        select: sinon.stub().resolves(null)
      };
      sinon.stub(User, 'findOne').returns(chainable);

      try {
        await authService.loginUser({ email: 'nonexistent@example.com', password: 'password123' });
        expect.fail('Should have thrown error');
      } catch (err) {
        expect(err).to.be.an.instanceOf(UnauthorizedError);
      }
    });
  });

  describe('Auth Endpoints (Supertest)', () => {
    it('POST /api/auth/signup - should validate missing fields', async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({ name: 'Test User' });

      expect(res.status).to.equal(400);
      expect(res.body.success).to.be.false;
      expect(res.body.message).to.include('required fields');
    });

    it('POST /api/auth/login - should validate missing credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({});

      expect(res.status).to.equal(400);
      expect(res.body.success).to.be.false;
    });

    it('POST /api/auth/logout - should return success response', async () => {
      const res = await request(app)
        .post('/api/auth/logout');

      expect(res.status).to.equal(200);
      expect(res.body.success).to.be.true;
      expect(res.body.message).to.equal('Logged out successfully');
    });

    it('GET /api/auth/me - should reject request without token', async () => {
      const res = await request(app)
        .get('/api/auth/me');

      expect(res.status).to.equal(401);
      expect(res.body.success).to.be.false;
      expect(res.body.message).to.include('No token provided');
    });

    it('GET /api/auth/me - should reject request with invalid token', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid_token_123');

      expect(res.status).to.equal(401);
      expect(res.body.success).to.be.false;
    });
  });
});
