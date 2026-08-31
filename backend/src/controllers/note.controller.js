const noteService = require('../services/note.service');

const createNote = async (req, res) => {
  const note = await noteService.createNote(req.user._id, req.body);
  res.status(201).json({
    success: true,
    message: 'Note created successfully',
    data: note
  });
};

const getNotes = async (req, res) => {
  const notes = await noteService.getNotes(req.user._id, req.query);
  res.status(200).json({
    success: true,
    count: notes.length,
    data: notes
  });
};

const getNoteById = async (req, res) => {
  const note = await noteService.getNoteById(req.user._id, req.params.id);
  res.status(200).json({
    success: true,
    data: note
  });
};

const updateNote = async (req, res) => {
  const note = await noteService.updateNote(req.user._id, req.params.id, req.body);
  res.status(200).json({
    success: true,
    message: 'Note updated successfully',
    data: note
  });
};

const deleteNote = async (req, res) => {
  const result = await noteService.deleteNote(req.user._id, req.params.id);
  res.status(200).json({
    success: true,
    message: 'Note deleted successfully',
    data: result
  });
};

module.exports = {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote
};
