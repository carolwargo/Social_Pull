const router = require("express").Router();
const {
  getAllThoughts,
  getThought,
  createThought,
  updateThought,
  deleteThought,
  addThoughtReaction,
  removeThoughtReaction,
} = require("../../controllers/thoughtController");

// /api/thoughts
router.route("/").get(getAllThoughts).post(createThought);

// api/thoughts/:thoughtId
router
  .route("/:thoughtId")
  .get(getThought)
  .put(updateThought)
  .delete(deleteThought);

router
  .route("/:thoughtId/reactions/:reactionId")
  .post(addThoughtReaction)
  .delete(removeThoughtReaction);

module.exports = router;
