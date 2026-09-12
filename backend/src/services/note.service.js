const Note = require('../models/note.model');
const { NotFoundError, ForbiddenError, BadRequestError } = require('../utils/errors');
const logger = require('../utils/logger');

/**
 * Escapes special regex metacharacters in user search input
 * @param {string} string
 * @returns {string}
 */
const escapeRegex = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const createNote = async (userId, noteData) => {
  const { title, content, tags, isPinned, color } = noteData;

  if (!title || !content) {
    throw new BadRequestError('Title and content are required.');
  }

  const note = await Note.create({
    title,
    content,
    tags: Array.isArray(tags) ? tags : [],
    isPinned: Boolean(isPinned),
    color: color || '#ffffff',
    user: userId
  });

  logger.info(`Note created by user ${userId}: ${note._id}`);
  return note;
};

const getNotes = async (userId, query = {}) => {
  const filter = { user: userId };

  if (query.search && typeof query.search === 'string') {
    const sanitizedSearch = query.search.trim().slice(0, 100);
    if (sanitizedSearch) {
      const escapedSearch = escapeRegex(sanitizedSearch);
      const searchRegex = new RegExp(escapedSearch, 'i');
      filter.$or = [
        { title: searchRegex },
        { content: searchRegex },
        { tags: searchRegex }
      ];
    }
  }

  if (query.tag) {
    filter.tags = query.tag;
  }

  if (query.isPinned !== undefined) {
    filter.isPinned = query.isPinned === 'true';
  }

  const limit = Math.min(parseInt(query.limit, 10) || 100, 100);

  const notes = await Note.find(filter)
    .sort({ isPinned: -1, createdAt: -1 })
    .limit(limit)
    .maxTimeMS(5000);

  return notes;
};

const getNoteById = async (userId, noteId) => {
  const note = await Note.findById(noteId);

  if (!note) {
    throw new NotFoundError('Note not found.');
  }

  if (note.user.toString() !== userId.toString()) {
    throw new ForbiddenError('Access denied. You do not own this note.');
  }

  return note;
};

const updateNote = async (userId, noteId, updateData) => {
  const note = await Note.findById(noteId);

  if (!note) {
    throw new NotFoundError('Note not found.');
  }

  if (note.user.toString() !== userId.toString()) {
    throw new ForbiddenError('Access denied. You cannot update this note.');
  }

  const allowedUpdates = ['title', 'content', 'tags', 'isPinned', 'color'];
  allowedUpdates.forEach((field) => {
    if (updateData[field] !== undefined) {
      note[field] = updateData[field];
    }
  });

  await note.save();
  logger.info(`Note ${noteId} updated by user ${userId}`);
  return note;
};

const deleteNote = async (userId, noteId) => {
  const note = await Note.findById(noteId);

  if (!note) {
    throw new NotFoundError('Note not found.');
  }

  if (note.user.toString() !== userId.toString()) {
    throw new ForbiddenError('Access denied. You cannot delete this note.');
  }

  await note.deleteOne();
  logger.info(`Note ${noteId} deleted by user ${userId}`);
  return { id: noteId };
};

module.exports = {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote
};
