//main
require('room_ext');
require('spawn_ext');
require('creep_ext');

if(Memory.data == undefined) Memory.data = {};

for(spawn in Game.spawns) {
    var spawn = Game.spawns[spawn];
    
    var res = spawn.createWorkerCreep([WORK, WORK, WORK, WORK, MOVE], 'Worker 7');
    if(res == 'Worker 7') console.log(res + " has been created");
    
    res = spawn.createWorkerCreep([WORK, WORK, WORK, MOVE], 'Worker 2');
    if(res == 'Worker 2') console.log(res + " has been created");
    
    res = spawn.createWorkerCreep([WORK, WORK, WORK, MOVE], 'Worker 6');
    if(res == 'Worker 6') console.log(res + " has been created");
    
    res = spawn.createWorkerCreep([MOVE, WORK, WORK, CARRY, CARRY, CARRY, MOVE], 'Worker 8');
    if(res == 'Worker 8') console.log(res + " has been created");
    
    res = spawn.createWorkerCreep([MOVE, WORK, WORK, CARRY, CARRY, MOVE], 'Worker 3');
    if(res == 'Worker 3') console.log(res + " has been created");
    
    res = spawn.createWorkerCreep([MOVE, WORK, CARRY, CARRY, CARRY, MOVE], 'Worker 4');
    if(res == 'Worker 4') console.log(res + " has been created");
    
    res = spawn.createWorkerCreep([MOVE, WORK, CARRY, CARRY, CARRY, MOVE], 'Worker 5');
    if(res == 'Worker 5') console.log(res + " has been created");
    
    res = spawn.createWorkerCreep([WORK, CARRY, MOVE], 'Worker 0');
    if(res == 'Worker 0') console.log(res + " has been created");
    
    res = spawn.createWorkerCreep([WORK, CARRY, MOVE], 'Worker 1');
    if(res == 'Worker 1') console.log(res + " has been created");
    
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
console.log(Game.getUsedCpu());
for(room in Game.rooms) {
    room = Game.rooms[room];
    room.tick();
}
//console.log(Game.getUsedCpu());
