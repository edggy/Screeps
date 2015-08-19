/**
 * 
 */

require('Spawn');
require('Creep');
require('Structure');
require('Room');
require('Flag');

var Util = require('Util');

for(spawn in Game.spawns) {
	Game.spawns[spawn].tick();
}

for(creep in Game.creeps) {
	Game.creeps[creep].tick();
}

for(structure in Game.structures) {
	Game.structures[structure].tick();
}

for(room in Game.rooms) {
	Game.rooms[room].tick();
}

for(flag in Game.flags) {
	Game.flags[flag].tick();
}