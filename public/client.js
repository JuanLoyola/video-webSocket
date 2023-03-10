const socket = new WebSocket("ws://localhost:3000");

const playButton = document.querySelector("#play-button");
const pauseButton = document.querySelector("#pause-button");

// Escuchamos el evento message del socket
socket.addEventListener("message", (event) => {
	// Parseamos el mensaje recibido
	const message = JSON.parse(event.data);

	if (message.type === "state") {
		// Si el estado es "play", reproducimos el video
		if (message.data === "play") {
			document.querySelector("#video-player").play();
		}
		// Si el estado es "pause", pausamos el video
		else if (message.data === "pause") {
			document.querySelector("#video-player").pause();
		}
	}
});

playButton.addEventListener("click", () => {
	// Enviamos un mensaje al servidor indicando que se hizo clic en Play
	socket.send(JSON.stringify({ type: "play" }));
});

pauseButton.addEventListener("click", () => {
	// Enviamos un mensaje al servidor indicando que se hizo clic en Pause
	socket.send(JSON.stringify({ type: "pause" }));
});
