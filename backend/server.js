const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const app = express();
const port = 8080;

app.use(express.json());
app.use(cors());

const db = new sqlite3.Database(":memory:");

db.serialize(() => {
  db.run(
    "CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)"
  );

  db.run(
    "CREATE TABLE IF NOT EXISTS blog (id INTEGER PRIMARY KEY AUTOINCREMENT, created_id INTEGER, tag TEXT, subject TEXT, detail TEXT, FOREIGN KEY (created_id) REFERENCES users (id))"
  );

  db.run(
    "CREATE TABLE IF NOT EXISTS comments (id INTEGER PRIMARY KEY AUTOINCREMENT, blog_id INTEGER, created_id INTEGER, comment TEXT, FOREIGN KEY (blog_id) REFERENCES blog (id), FOREIGN KEY (created_id) REFERENCES users (id))"
  );

  //insert users
  db.run("INSERT INTO users (name) VALUES (?)", ["Wittawat"]);
  db.run("INSERT INTO users (name) VALUES (?)", ["Wittawat89"]);

  //insert blog
  db.run(
    "INSERT INTO blog (created_id, tag, subject, detail) VALUES (?, ?, ?, ?)",
    [
      1,
      "Hisyory",
      "The Beginning of the End of the World",
      "Tall, athletic, handsome with cerulean eyes, he was the kind of hyper-ambitious kid other kids loved to hate and just the type to make a big wager with no margin for error. But on the night before the S.A.T., his father took pity on him and canceled the bet. “I would’ve lost it,” Ackman concedes. He got a 780 on the verbal and a 750 on the math. “One wrong on the verbal, three wrong on the math,” he muses. “I’m still convinced some of the questions were wrong.”",
    ]
  );

  //insert comment
  db.run(
    "INSERT INTO comments (created_id, blog_id , comment) VALUES (?, ?, ?)",
    [
      2,
      1,
      "Lorem ipsum dolor sit amet consectetur. Purus cursus vel est a pretium quam imperdiet. Tristique auctor sed semper nibh odio iaculis sed aliquet. Amet mollis eget morbi feugiat mi risus eu. Tortor sed sagittis convallis auctor.",
    ]
  );
});
app.post("/api/users", (req, res) => {
  const name = req.body.name;
  db.get("SELECT * FROM users WHERE name = ?", [name], (err, row) => {
    if (!row) {
      db.run("INSERT INTO users (name) VALUES (?)", [name], function (err) {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({
          data: { id: this.lastID, name: name },
        });
      });
    } else {
      res.json({
        data: row,
      });
    }
  });
});

app.get("/api/users/:id", (req, res) => {
  const id = req.params.id;
  db.get("SELECT * FROM users WHERE id = ?", [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json({
      data: { id: row.id, name: row.name },
    });
  });
});

app.post("/api/blog", (req, res) => {
  const { created_id, tag, subject, detail } = req.body;
  db.run(
    "INSERT INTO blog (created_id, tag, subject, detail) VALUES (?, ?, ?, ?)",
    [created_id, tag, subject, detail],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({
        data: { id: this.lastID, created_id, tag, subject, detail },
      });
    }
  );
});

app.get("/api/blog", (req, res) => {
  const query = `
    SELECT blog.id, blog.created_id, blog.tag, blog.subject, blog.detail, users.name as created_by, COUNT(comments.id) as comment_count
    FROM blog
    INNER JOIN users ON blog.created_id = users.id
    LEFT JOIN comments ON blog.id = comments.blog_id
    GROUP BY blog.id
    ORDER BY blog.id DESC
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      data: rows,
    });
  });
});

app.get("/api/blog/:blog_id", (req, res) => {
  const blog_id = req.params.blog_id;
  db.get(
    "SELECT *, users.name as created_by FROM blog INNER JOIN users ON blog.created_id = users.id WHERE blog.id = ?",
    [blog_id],
    (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (!row) {
        res.status(404).json({ error: "Blog not found" });
        return;
      }
      res.json({
        data: row,
      });
    }
  );
});

app.post("/api/comments", (req, res) => {
  const { blog_id, created_id, comment } = req.body;
  db.run(
    "INSERT INTO comments (blog_id, created_id, comment) VALUES (?, ?, ?)",
    [blog_id, created_id, comment],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({
        data: { id: this.lastID, blog_id, created_id, comment },
      });
    }
  );
});

app.get("/api/blog/:blog_id/comments", (req, res) => {
  const blog_id = req.params.blog_id;
  const query =
    "SELECT * , users.name as created_by FROM comments LEFT JOIN users ON comments.created_id = users.id WHERE comments.blog_id = ? ORDER BY comments.id DESC";
  db.all(query, [blog_id], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      data: rows,
    });
  });
});

// Debugging
app.get("/api/debug/users", (req, res) => {
  db.all("SELECT * FROM users", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      data: rows,
    });
  });
});

app.get("/api/debug/blog", (req, res) => {
  db.all("SELECT * FROM blog", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      data: rows,
    });
  });
});

app.get("/api/debug/comments", (req, res) => {
  db.all("SELECT * FROM comments", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      data: rows,
    });
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
