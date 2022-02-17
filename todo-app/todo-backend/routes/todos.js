const express = require("express");
const { Todo } = require("../mongo");
const router = express.Router();
const { getAsync, setAsync } = require("../redis");

const todoCounter = async () => {
  const count = await getAsync("count");
  console.log(count);
  return count ? setAsync("count", parseInt(count) + 1) : setAsync("count", 1);
};

/* GET todos listing. */
router.get("/", async (_, res) => {
  const todos = await Todo.find({});
  res.send(todos);
});

router.get("/statistics", async (_, res) => {
  const count = await getAsync("count");

  console.log("stats", count);

  return res.json({ added_todos: count || 0});
});

/* POST todo to listing. */
router.post("/", async (req, res) => {
  todoCounter();

  const todo = await Todo.create({
    text: req.body.text,
    done: false,
  });
  res.send(todo);
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params;
  req.todo = await Todo.findById(id);
  if (!req.todo) return res.sendStatus(404);

  next();
};

/* DELETE todo. */
singleRouter.delete("/", async (req, res) => {
  await req.todo.delete();
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get("/", async (req, res) => {
  res.send(req.todo);
});

/* PUT todo. */
singleRouter.put("/", async (req, res) => {
  const { text, done } = req.body;
  const response = await req.todo.updateOne({ text, done });
  res.send(response);
});

router.use("/:id", findByIdMiddleware, singleRouter);

module.exports = router;