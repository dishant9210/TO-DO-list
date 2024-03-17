import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "Permalist",
  password: "9354797837Dd@",
  port: 5432,
});
db.connect();

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];

async function getItems(){
  const result = await db.query("SELECT * FROM items");
  
  return result.rows;
}
app.get("/", async (req, res) => {
  const  items =  await getItems();
 
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add", async (req, res) => {
  
  const item = req.body.newItem;
  const result = await db.query("INSERT INTO items(title) VALUES($1) returning *",[item]);
  res.redirect("/");
});

app.post("/edit", async (req, res) => {
  
  const id = req.body.updatedItemId;
  const title = req.body.updatedItemTitle;
  const result = await db.query("UPDATE items SET title  = $1 WHERE id = $2 returning *",[title,id]);
  console.log(result.rows);
  res.redirect("/");
});

app.post("/delete", async(req, res) => {
  console.log(req.body);
  const id = req.body.deleteItemId;
  const result = db.query("DELETE FROM items WHERE id = $1 returning *",[id]);
  console.log(result.rows);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
