import { WebSocketServer } from 'ws';
import http from 'http';

const PORT = process.env.PORT || 3000;

const world = {
  rooms: {
    entrance: {
      title: 'Entrance',
      description: 'neque porro quisquam est qui dolorem ipsum quia dolor sit amet.',
      exits: { north: 'hall', east: 'study' },
      objects: ['door', 'floor']
    },
    hall: {
      title: 'Hall',
      description: 'consectetur adipisci velit. sed quia non numquam eius modi tempora incidunt.',
      exits: { south: 'entrance', north: 'library', west: 'archive' },
      objects: ['stairs', 'portrait', 'clock']
    },
    study: {
      title: 'Study',
      description: 'ut labore et dolore magnam aliquam quaerat voluptatem.',
      exits: { west: 'entrance', north: 'bedroom' },
      objects: ['desk', 'books', 'lamp']
    },
    library: {
      title: 'Library',
      description: 'Ut enim ad minima veniam, quis nostrum exercitationem.',
      exits: { south: 'hall', east: 'bedroom', west: 'archive' },
      objects: ['shelves', 'tome', 'window']
    },
    bedroom: {
      title: 'Bedroom',
      description: 'ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi.',
      exits: { west: 'library', south: 'study' },
      objects: ['bed', 'mirror', 'wardrobe']
    },
    archive: {
      title: 'Archive',
      description: 'consequatur quis autem vel eum iure reprehenderit qui in ea voluptate.',
      exits: { east: 'hall', south: 'study' },
      objects: ['ledger', 'records', 'chest']
    }
  },
  objects: {
    door: { description: 'A heavy oak door, firmly shut.' },
    floor: { description: 'Cold stone beneath your feet.' },
    stairs: { description: 'Worn stone steps leading upward.' },
    portrait: { description: 'An old family portrait, details obscured.' },
    clock: { description: 'A grandfather clock, ticking slowly.' },
    desk: { description: 'A mahogany desk covered in papers.' },
    books: { description: 'Shelves of leather-bound volumes.' },
    lamp: { description: 'An oil lamp, unlit and cold.' },
    shelves: { description: 'Towering shelves laden with tomes.' },
    tome: { description: 'An ancient book, title illegible.' },
    window: { description: 'A window, view obscured by dust.' },
    bed: { description: 'A simple bed with plain bedding.' },
    mirror: { description: 'A mirror, its surface somewhat tarnished.' },
    wardrobe: { description: 'An old wardrobe, doors slightly ajar.' },
    ledger: { description: 'A leather ledger, pages yellowed.' },
    records: { description: 'Stacks of old records and documents.' },
    chest: { description: 'A wooden chest, locked.' }
  }
};

const playerSessions = new Map();

class Player {
  constructor(id) {
    this.id = id;
    this.currentRoom = 'entrance';
    this.inventory = [];
  }

  getRoom() {
    return world.rooms[this.currentRoom];
  }

  look() {
    const room = this.getRoom();
    let output = `\n[ ${room.title} ]\n\n${room.description}\n\n`;
    if (room.objects.length > 0) {
      output += `Visible: ${room.objects.join(', ')}\n`;
    }
    const exits = Object.keys(room.exits);
    if (exits.length > 0) {
      output += `Exits: ${exits.join(', ')}\n`;
    }
    return output;
  }

  go(direction) {
    const room = this.getRoom();
    if (!room.exits[direction]) {
      return `You cannot go ${direction} from here.\n`;
    }
    this.currentRoom = room.exits[direction];
    return this.look();
  }

  examine(object) {
    const room = this.getRoom();
    if (!room.objects.includes(object)) {
      return `You do not see that here.\n`;
    }
    if (!world.objects[object]) {
      return `You cannot examine that.\n`;
    }
    return `${world.objects[object].description}\n`;
  }

  say(text) {
    return `You say: ${text}\n`;
  }

  inventory() {
    if (this.inventory.length === 0) {
      return `You are carrying nothing.\n`;
    }
    return `You are carrying: ${this.inventory.join(', ')}\n`;
  }

  help() {
    return `\nAvailable commands:\nlook - examine surroundings\ngo [direction] - move in a direction\nexamine [object] - inspect an object\nsay [text] - speak\ninventory - view inventory\nhelp - show this message\n\n`;
  }

  processCommand(input) {
    const trimmed = input.trim().toLowerCase();
    const parts = trimmed.split(/\s+/);
    const command = parts[0];
    const args = parts.slice(1).join(' ');

    switch (command) {
      case 'look':
        return this.look();
      case 'go':
        return this.go(args);
      case 'examine':
      case 'x':
        return this.examine(args);
      case 'say':
        return this.say(args);
      case 'inventory':
        return this.inventory();
      case 'help':
        return this.help();
      default:
        return `Unknown command: ${command}\n`;
    }
  }
}

const server = http.createServer();
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  const playerId = Math.random().toString(36).substring(7);
  const player = new Player(playerId);
  playerSessions.set(playerId, player);

  ws.send(player.help() + player.look());

  ws.on('message', (message) => {
    const output = player.processCommand(message);
    ws.send(output);
  });

  ws.on('close', () => {
    playerSessions.delete(playerId);
  });

  ws.on('error', (error) => {
    console.error(`Error on connection ${playerId}:`, error);
  });
});

server.listen(PORT, () => {
  console.log(`MUSH server running on port ${PORT}`);
});
