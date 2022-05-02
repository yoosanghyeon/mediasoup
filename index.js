import http from  "http";
import SocketIO from "socket.io";
import express from "express";
import path from "path";
import cors from 'cors';
import fs from "fs";

const app = express();



const port = 2000;

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));



app.get("/", (_, res) => {
  res.send("Hello");
});


app.get("/count", (req, res) => {
  res.send(users);
});

app.get("/*", (_, res) => res.redirect("/"));



const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);




const handleListen = () => console.log(`Listening on http://localhost:${port}`);
httpServer.listen(port, handleListen);
