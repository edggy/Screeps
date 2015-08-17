//main
require('Room');
require('Spawn');
require('Creep');

if(Memory.data == undefined) Memory.data = {};

if(Game.time % 100 == 0) {
	for(var i in Memory.creeps) {
	    if(!Game.creeps[i]) {
	        delete Memory.creeps[i];
	    }
	}
	for(var i in Game.creeps) {
	    if(!Memory.creeps[i]) {
	        Memory.creeps[i] = Game.creeps[i];
	    }
	}
}

var spawn_count = 0;
for(spawn in Game.spawns) {
	var res = false;
	spawn_count++;
	//console.log(Game.time % (3 * Object.keys(Game.creeps).length + Object.keys(Game.spawns).length + 1));
	if((Game.time % (3 * Object.keys(Game.creeps).length + Object.keys(Game.spawns).length + 1)) != spawn_count) continue;
    var spawn = Game.spawns[spawn];
    
    var num_miner = _(Game.creeps).filter( { memory: { role: 'Head' } } ).size();
    var num_pickup = _(Game.creeps).filter( { memory: { role: 'Pickup' } } ).size();
    var num_tail = _(Game.creeps).filter( { memory: { role: 'Tail' } } ).size();
    //console.log('Miners: ' + num_miner + ' Workers: ' + num_pickup + ' Tails: ' + num_tail);
    
    if(Object.keys(Game.creeps).length < 4) {
	    res = spawn.createWorkerCreep([WORK, MOVE], 'Worker 0', {role: 'Head'});
	    if(typeof res != 'string') {
	    	res = spawn.createWorkerCreep([CARRY, MOVE], 'Worker 1', {role: 'Pickup'});
	    }
	}
	

    if(spawn.memory.max == undefined) spawn.memory.max == {};
    if(spawn.memory.max['Head'] == undefined) spawn.memory.max['Head'] == 3;
    if(spawn.memory.max['Worker'] == undefined) spawn.memory.max['Worker'] == 6;
    if(spawn.memory.max['Tail'] == undefined) spawn.memory.max['Tail'] == 2;
    
    
    if(typeof res != 'string' && num_pickup < spawn.memory.max.worker && (num_miner > num_pickup || num_miner == spawn.memory.max.miner)) {
	    //var body = [MOVE, CARRY, WORK, MOVE, CARRY, WORK, MOVE, CARRY, CARRY, MOVE, CARRY, WORK, MOVE, CARRY, CARRY, MOVE, CARRY, WORK];
	    var body = [MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE];
	    res = spawn.createLongestCreep(body, 'Worker', {role: 'Pickup'});
    }
    
    //console.log(typeof res != 'string' && num_miner < spawn.memory.max.miner);
    
    if(typeof res != 'string' && num_miner < spawn.memory.max.miner) {
	    var body = [MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK];
	    res = spawn.createLongestCreep(body, 'Head', {role: 'Head'});
	}
    
    if(typeof res != 'string' && num_tail < spawn.memory.max.tail) {
	    var body = [MOVE, CARRY, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK]
	    res = spawn.createLongestCreep(body, 'Tail', {role: 'Tail'});
    }
    if(typeof res == 'string') {
    	console.log(res + " has been created");
    }
    
    spawn.pos.mark();
    
}

for(creep in Game.creeps) {
    var creep = Game.creeps[creep];
    creep.tick();
    //console.log(Game.rooms[creep.pos.roomName]);
}

for(structure in Game.structures) {
    var structure = Game.structures[structure];
}

for(room in Game.rooms) {
    room = Game.rooms[room];
    room.tick();
}
//console.log(Game.getUsedCpu());
