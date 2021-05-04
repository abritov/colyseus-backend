import { Room, Client } from "colyseus";
import { Schema, type, MapSchema } from "@colyseus/schema";

class Player extends Schema {
    @type("number")
    x = Math.floor(Math.random() * 400);

    @type("number")
    y = Math.floor(Math.random() * 400);
}

class State extends Schema {
    @type({ map: Player })
    players = new MapSchema<Player>();

    something = "This attribute won't be sent to the client-side";

    createPlayer(sessionId: string) {
        this.players.set(sessionId, new Player());
    }

    removePlayer(sessionId: string) {
        this.players.delete(sessionId);
    }

    movePlayer(sessionId: string, movement: any) {
        const player = this.players.get(sessionId);
        if (player) {
            if (movement.x) {
                player.x += movement.x * 10;

            } else if (movement.y) {
                player.y += movement.y * 10;
            }
        }
    }
}

export class GameRoom extends Room<State> {
    maxClients = 4;

    onCreate(options: any) {
        console.log("StateHandlerRoom created!", options);

        this.setState(new State());

        this.onMessage("move", (client, data) => {
            console.log("StateHandlerRoom received message from", client.sessionId, ":", data);
            this.state.movePlayer(client.sessionId, data);
        });
    }

    onAuth(client: any, options: any, req: any) {
        return true;
    }

    onJoin(client: Client) {
        console.log('join');
        client.send("hello", "world");
        this.state.createPlayer(client.sessionId);
    }

    onLeave(client: Client) {
        this.state.removePlayer(client.sessionId);
    }

    onDispose() {
        console.log("Dispose StateHandlerRoom");
    }

}