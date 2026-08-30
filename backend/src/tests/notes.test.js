const { expect } = require('chai');
const request = require('supertest');
const sinon = require('sinon');
const app = require('../app');
const noteService = require('../services/note.service');
const Note = require('../models/note.model');
const { BadRequestError, NotFoundError, ForbiddenError } = require('../utils/errors');

describe('Notes Module Unit Tests', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('Notes Service Validation & Logic', () => {
    it('should throw BadRequestError if title or content is missing on creation', async () => {
      try {
        await noteService.createNote('user123', { title: '', content: '' });
        expect.fail('Should have thrown error');
      } catch (err) {
        expect(err).to.be.an.instanceOf(BadRequestError);
        expect(err.message).to.equal('Title and content are required.');
      }
    });

    it('should create a note successfully when valid data is provided', async () => {
      const fakeNote = {
        _id: '507f1f77bcf86cd799439011',
        title: 'Meeting Notes',
        content: '<p>Rich text content</p>',
        tags: ['work'],
        isPinned: true,
        color: '#ffeb3b',
        user: 'user123'
      };

      sinon.stub(Note, 'create').resolves(fakeNote);

      const result = await noteService.createNote('user123', {
        title: 'Meeting Notes',
        content: '<p>Rich text content</p>',
        tags: ['work'],
        isPinned: true,
        color: '#ffeb3b'
      });

      expect(result.title).to.equal('Meeting Notes');
      expect(result.user).to.equal('user123');
    });

    it('should throw NotFoundError if updating a non-existent note', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      sinon.stub(Note, 'findById').resolves(null);

      try {
        await noteService.updateNote('user123', fakeId, { title: 'Updated Title' });
        expect.fail('Should have thrown error');
      } catch (err) {
        expect(err).to.be.an.instanceOf(NotFoundError);
        expect(err.message).to.equal('Note not found.');
      }
    });

    it('should throw ForbiddenError if user attempts to update another user note', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const fakeNote = {
        _id: fakeId,
        user: 'different_user_456',
        title: 'Other User Note'
      };
      sinon.stub(Note, 'findById').resolves(fakeNote);

      try {
        await noteService.updateNote('user123', fakeId, { title: 'Hacked Title' });
        expect.fail('Should have thrown error');
      } catch (err) {
        expect(err).to.be.an.instanceOf(ForbiddenError);
        expect(err.message).to.include('You cannot update this note');
      }
    });

    it('should throw NotFoundError if deleting a non-existent note', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      sinon.stub(Note, 'findById').resolves(null);

      try {
        await noteService.deleteNote('user123', fakeId);
        expect.fail('Should have thrown error');
      } catch (err) {
        expect(err).to.be.an.instanceOf(NotFoundError);
        expect(err.message).to.equal('Note not found.');
      }
    });

    it('should throw ForbiddenError if user attempts to delete another user note', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const fakeNote = {
        _id: fakeId,
        user: 'user999',
        title: 'Protected Note'
      };
      sinon.stub(Note, 'findById').resolves(fakeNote);

      try {
        await noteService.deleteNote('user123', fakeId);
        expect.fail('Should have thrown error');
      } catch (err) {
        expect(err).to.be.an.instanceOf(ForbiddenError);
        expect(err.message).to.include('You cannot delete this note');
      }
    });
  });

  describe('Notes Endpoints Security (Supertest)', () => {
    it('GET /api/notes - should block unauthorized access', async () => {
      const res = await request(app).get('/api/notes');
      expect(res.status).to.equal(401);
      expect(res.body.success).to.be.false;
    });

    it('POST /api/notes - should block unauthorized access', async () => {
      const res = await request(app)
        .post('/api/notes')
        .send({ title: 'Test Note', content: 'Test Content' });
      expect(res.status).to.equal(401);
      expect(res.body.success).to.be.false;
    });

    it('PUT /api/notes/:id - should block unauthorized access', async () => {
      const res = await request(app)
        .put('/api/notes/507f1f77bcf86cd799439011')
        .send({ title: 'Updated' });
      expect(res.status).to.equal(401);
      expect(res.body.success).to.be.false;
    });

    it('DELETE /api/notes/:id - should block unauthorized access', async () => {
      const res = await request(app)
        .delete('/api/notes/507f1f77bcf86cd799439011');
      expect(res.status).to.equal(401);
      expect(res.body.success).to.be.false;
    });
  });
});
