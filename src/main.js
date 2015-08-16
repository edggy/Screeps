//main
require('room_ext');
require('spawn_ext');
require('creep_ext');

if(Memory.data == undefined) Memory.data = {};

var spawn_count = 0;
for(spawn in Game.spawns) {
	if((Game.time % (10 + Object.keys(Game.spawns).length)) != spawn_count) continue;
    var spawn = Game.spawns[spawn];
    
    if(Game.creeps.length < 4) {
	    res = spawn.createWorkerCreep([WORK, MOVE], 'Worker 0', {role: 'Miner'});
	    if(res == 'Miner 0') console.log(res + " has been created");
	    
	    res = spawn.createWorkerCreep([CARRY, MOVE], 'Worker 1', {role: 'Pickup'});
	    if(res == 'Worker 0') console.log(res + " has been created");
	}
    
    var num_miner = _(Game.creeps).filter( { memory: { role: 'Miner' } } ).size();
    if(num_miner < 6) {
	    var body = [MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK];
	    var res = spawn.createLongestCreep(body, 'Miner', {role: 'Miner'});
	    if(res instanceof String) {
	    	console.log(res + " has been created");
	    }
	}
    
    var num_pickup = _(Game.creeps).filter( { memory: { role: 'Pickup' } } ).size();
    if(num_pickup < 8) {
	    var body = [MOVE, CARRY, WORK, MOVE, CARRY, WORK, MOVE, CARRY, WORK, MOVE, CARRY, WORK, MOVE, CARRY, WORK, MOVE, CARRY, WORK]
	    var res = spawn.createLongestCreep(body, 'Worker', {role: 'Pickup'});
	    if(res instanceof String) {
	    	console.log(res + " has been created");
	    }
    }
    //console.log('Miners: ' + num_miner + ' Workers: ' + num_pickup);
    //var res = spawn.createWorkerCreep([WORK, WORK, WORK, WORK, MOVE], 'Worker 7');
    //if(res == 'Worker 7') console.log(res + " has been created");
    
    //res = spawn.createWorkerCreep([WORK, WORK, WORK, MOVE], 'Worker 2');
    //if(res == 'Worker 2') console.log(res + " has been created");
    
    //res = spawn.createWorkerCreep([WORK, WORK, WORK, MOVE], 'Worker 6');
    //if(res == 'Worker 6') console.log(res + " has been created");
    
    /*res = spawn.createWorkerCreep([MOVE, WORK, WORK, CARRY, CARRY, CARRY, MOVE], 'Worker 8');
    if(res == 'Worker 8') console.log(res + " has been created");
    
    res = spawn.createWorkerCreep([MOVE, WORK, WORK, CARRY, CARRY, MOVE], 'Worker 3');
    if(res == 'Worker 3') console.log(res + " has been created");
    
    res = spawn.createWorkerCreep([MOVE, WORK, CARRY, CARRY, CARRY, MOVE], 'Worker 4');
    if(res == 'Worker 4') console.log(res + " has been created");
    
    res = spawn.createWorkerCreep([MOVE, WORK, CARRY, CARRY, CARRY, MOVE], 'Worker 5');
    if(res == 'Worker 5') console.log(res + " has been created");
    */
    
    
    
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
