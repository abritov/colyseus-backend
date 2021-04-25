import cors from 'cors';
import path from 'path';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'colyseus';
import { GameRoom } from './room';

const port = Number(process.env.PORT || 3000) + Number(process.env.NODE_APP_INSTANCE || 0);
const app = express();

app.use(cors());
app.use(express.json());

// Attach WebSocket Server on HTTP Server.
const gameServer = new Server({
  server: createServer(app),
  express: app,
  pingInterval: 0,
});

gameServer.define("game", GameRoom)
    .enableRealtimeListing();

gameServer.onShutdown(() => {
    console.log(`game server is going down.`);
});

app.use(express.static(path.join(__dirname, "../public")));

gameServer.listen(port);

console.log(`Listening on http://localhost:${ port }`);
// app.listen(port, () => {
//     console.log(`Listening on http://localhost:${ port }`);
// });