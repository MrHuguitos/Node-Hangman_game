import express from "express";
import path from "path";
import routes from "./src/routes/gameRoute.js";

const app = express();
app.use(express.static(path.resolve("front")));

app.listen(3000, () => {
    console.log("server escutando...");
});

routes(app);