
import express from "express";
import path from "path";
import http from "http";
import { Server } from "socket.io";
import ejs from "ejs";

import { URL } from "url";
const __filename = new URL("", import.meta.url).pathname;
const __dirname = new URL(".", import.meta.url).pathname;

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "public"));
app.engine("html", ejs.renderFile);
app.set("view engine", "html");

app.use("/", (req, res) => {
	res.render("index.html");
});

let messages = [];

io.on("connection", socket => {
	console.log(`Socket conectado, ${socket.id}`);
	
	socket.emit("previousMessages", messages);

	socket.on("sendMessage", message => {
		messages.push(message);
		socket.broadcast.emit("receivedMessage", message);
	});
	
});

server.listen(3000, ()=>{
	console.log("Server Running, http://localhost:3000");
});