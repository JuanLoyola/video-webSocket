const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
	console.log(`Listening on port ${port}...`);
});

// Los archivos estáticos estarán en la carpeta "public"
app.use(express.static("public"));

const WebSocket = require("ws");
const wss = new WebSocket.Server({ server });

let videoState = "pause";

wss.on("connection", (ws) => {
	// Enviamos el estado actual del video al usuario
	ws.send(JSON.stringify({ type: "state", data: videoState }));

	// Cuando recibimos un mensaje del usuario
	ws.on("message", (message) => {
		// Parseamos el mensaje
		const parsedMessage = JSON.parse(message);

		switch (parsedMessage.type) {
			// Type = State
			// EJ: El usuario quiere reproducir o pausar
			// Actualizamos el state y lo enviamos a todos los usuarios conectados
			case "play":
				videoState = "play";
				wss.clients.forEach((client) => {
					if (client.readyState === WebSocket.OPEN) {
						client.send(
							JSON.stringify({ type: "state", data: videoState })
						);
					}
				});
				break;
			case "pause":
				videoState = "pause";
				wss.clients.forEach((client) => {
					if (client.readyState === WebSocket.OPEN) {
						client.send(
							JSON.stringify({ type: "state", data: videoState })
						);
					}
				});
				break;
			// Si el mensaje no es de un tipo soportado
			default:
				console.log(`Unsupported message type: ${parsedMessage.type}`);
				break;
		}
	});
});
