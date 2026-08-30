const express = require('express');
const router = express.Router();
const noteController = require('../controllers/note.controller');
const { protect } = require('../middlewares/auth.middleware');

// Protect all note routes
router.use(protect);

router.route('/')
  .post(noteController.createNote)
  .get(noteController.getNotes);

router.route('/:id')
  .get(noteController.getNoteById)
  .put(noteController.updateNote)
  .delete(noteController.deleteNote);

module.exports = router;
