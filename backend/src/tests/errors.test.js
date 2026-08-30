const { expect } = require('chai');
const request = require('supertest');
const app = require('../app');
const {
  AppError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError
} = require('../utils/errors');

describe('Error Utility and Middleware Unit Tests', () => {
  it('AppError should set default status code and properties correctly', () => {
    const err = new AppError('Something went wrong', 500);
    expect(err.statusCode).to.equal(500);
    expect(err.status).to.equal('error');
    expect(err.message).to.equal('Something went wrong');
    expect(err.isOperational).to.be.true;
  });

  it('BadRequestError should set 400 status code', () => {
    const err = new BadRequestError('Invalid payload');
    expect(err.statusCode).to.equal(400);
    expect(err.status).to.equal('fail');
  });

  it('UnauthorizedError should set 401 status code', () => {
    const err = new UnauthorizedError();
    expect(err.statusCode).to.equal(401);
  });

  it('ForbiddenError should set 403 status code', () => {
    const err = new ForbiddenError();
    expect(err.statusCode).to.equal(403);
  });

  it('NotFoundError should set 404 status code', () => {
    const err = new NotFoundError();
    expect(err.statusCode).to.equal(404);
  });

  it('ConflictError should set 409 status code', () => {
    const err = new ConflictError();
    expect(err.statusCode).to.equal(409);
  });

  it('Should handle 404 routes gracefully with clean JSON', async () => {
    const res = await request(app).get('/api/invalid-route-12345');
    expect(res.status).to.equal(404);
    expect(res.body.success).to.be.false;
    expect(res.body.statusCode).to.equal(404);
    expect(res.body.message).to.include('not found');
  });
});
