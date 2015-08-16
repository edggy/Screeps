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
}

var spawn_count = 0;
for(spawn in Game.spawns) {
	var res = false;
	spawn_count++;
	if((Game.time % (10 + Object.keys(Game.spawns).length)) != spawn_count) continue;
	
    var spawn = Game.spawns[spawn];
    
    var num_miner = _(Game.creeps).filter( { memory: { role: 'Miner' } } ).size();
    var num_pickup = _(Game.creeps).filter( { memory: { role: 'Pickup' } } ).size();
    
    if(Game.creeps.length < 4) {
	    res = spawn.createWorkerCreep([WORK, MOVE], 'Worker 0', {role: 'Miner'});
	    if(!(res instanceof String)) {
	    	res = spawn.createWorkerCreep([CARRY, MOVE], 'Worker 1', {role: 'Pickup'});
	    }
	}
    if(typeof res != 'string' && num_miner < 6) {
	    var body = [MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK];
	    res = spawn.createLongestCreep(body, 'Miner', {role: 'Miner'});
	}
    
    if(typeof res != 'string' && num_pickup < 12) {
	    var body = [MOVE, CARRY, WORK, MOVE, CARRY, WORK, MOVE, CARRY, CARRY, MOVE, CARRY, WORK, MOVE, CARRY, CARRY, MOVE, CARRY, WORK]
	    res = spawn.createLongestCreep(body, 'Worker', {role: 'Pickup'});
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
