//main
require('room_ext');
require('spawn_ext');
require('creep_ext');

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
	if((Game.time % (50 + Object.keys(Game.spawns).length)) != spawn_count) continue;
	
    var spawn = Game.spawns[spawn];
    
    var num_miner = _(Game.creeps).filter( { memory: { role: 'Miner' } } ).size();
    var num_pickup = _(Game.creeps).filter( { memory: { role: 'Pickup' } } ).size();
    var num_tail = _(Game.creeps).filter( { memory: { role: 'Tail' } } ).size();
    //console.log('Miners: ' + num_miner + ' Workers: ' + num_pickup + ' Tails: ' + num_tail);
    
    if(Game.creeps.length < 4) {
	    res = spawn.createWorkerCreep([WORK, MOVE], 'Worker 0', {role: 'Miner'});
	    if(!(res instanceof String)) {
	    	res = spawn.createWorkerCreep([CARRY, MOVE], 'Worker 1', {role: 'Pickup'});
	    }
	}
    if(spawns.memory.max == undefined) spawns.memory.max == {};
    if(spawns.memory.max.miner == undefined) spawns.memory.max.miner == 6;
    if(spawns.memory.max.worker == undefined) spawns.memory.max.worker == 6;
    if(spawns.memory.max.tail == undefined) spawns.memory.max.tail == 4;
    
    if(typeof res != 'string' && num_miner < spawns.memory.max.miner) {
	    var body = [MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK];
	    res = spawn.createLongestCreep(body, 'Miner', {role: 'Miner'});
	}
    
    if(typeof res != 'string' && num_pickup < spawns.memory.max.worker) {
	    var body = [MOVE, CARRY, WORK, MOVE, CARRY, WORK, MOVE, CARRY, CARRY, MOVE, CARRY, WORK, MOVE, CARRY, CARRY, MOVE, CARRY, WORK]
	    res = spawn.createLongestCreep(body, 'Worker', {role: 'Pickup'});
    }
    
    if(typeof res != 'string' && num_tail < spawns.memory.max.tail) {
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
