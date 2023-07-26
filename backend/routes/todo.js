import express  from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("list of Todos");
});

router.get("/:todoId", (req, res) => {
  const { todoId } = req.params;
  res.send("Details of Todo " + todoId);
});

router.post("/", (req, res) => {
    const { title } = req.params;
    res.send("Add a Todo " + todoId);
  });

export default router;
