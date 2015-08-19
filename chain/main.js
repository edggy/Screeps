//main

require('Spawn');
require('Creep');

/*for(var i in Memory.creeps) {
    if(!Game.creeps[i]) {
        delete Memory.creeps[i];
    }
}*/

var spawn_count = 0;
for(spawn in Game.spawns) {
    var spawn = Game.spawns[spawn];
    if(spawn.memory.max === undefined) spawn.memory.max = {miner: 0, worker: 0, tail: 0};

    if(spawn.room.energyAvailable >= spawn.room.energyCapacityAvailable) {
	    
	}
	else if((Game.time % (3 * Object.keys(Game.creeps).length + Object.keys(Game.spawns).length + 1)) != spawn_count) continue;
	
	var num_miner = _(Game.creeps).filter( { memory: { role: 'Head' } } ).size();
    var num_pickup = _(Game.creeps).filter( { memory: { role: 'Work' } } ).size();
    var num_tail = _(Game.creeps).filter( { memory: { role: 'Tail' } } ).size();
    
    console.log('Head: '+num_miner + '/' +spawn.memory.max.miner +' Worker: '+num_pickup +'/' +spawn.memory.max.worker +' Tail: '+num_tail+'/'+spawn.memory.max.tail)
    if(spawn.memory.max == undefined) spawn.memory.max == {};
    if(spawn.memory.max['Head'] == undefined) spawn.memory.max['Head'] == 3;
    if(spawn.memory.max['Worker'] == undefined) spawn.memory.max['Worker'] == 6;
    if(spawn.memory.max['Tail'] == undefined) spawn.memory.max['Tail'] == 2;
    
    /*if(typeof res != 'string' && num_pickup < spawn.memory.max.worker && (num_miner > num_pickup || num_miner >= spawn.memory.max.miner)&& (num_tail > num_pickup || num_tail >= spawn.memory.max.tail)) {
	    //var body = [MOVE, CARRY, WORK, MOVE, CARRY, WORK, MOVE, CARRY, CARRY, MOVE, CARRY, WORK, MOVE, CARRY, CARRY, MOVE, CARRY, WORK];
	    
	    res = spawn.createLongestCreep(body, 'Worker', {role: 'Pickup'});
    }*/
    var res = null;
    if(typeof res != 'string' && num_pickup < spawn.memory.max.worker && (num_miner > num_pickup || num_miner >= spawn.memory.max.miner)&& (num_tail > num_pickup || num_tail >= spawn.memory.max.tail)) {
	    //var body = [MOVE, CARRY, WORK, MOVE, CARRY, WORK, MOVE, CARRY, CARRY, MOVE, CARRY, WORK, MOVE, CARRY, CARRY, MOVE, CARRY, WORK];
	    //var body = [MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE];
	    
	    var body = [MOVE, CARRY, CARRY, CARRY, CARRY, MOVE, CARRY, CARRY, CARRY, CARRY, MOVE, CARRY, CARRY, CARRY, CARRY, MOVE, CARRY, CARRY, CARRY, CARRY, MOVE, CARRY, CARRY, CARRY, CARRY];
    	while(body.length > Memory.global.roles.Work.bodyLimit) body.pop();
	    //var body = [MOVE, CARRY, CARRY, CARRY, CARRY, MOVE, CARRY, CARRY, CARRY, CARRY];
	    
	    //if(Math.random() > (num_pickup+200)/(spawn.memory.max.worker+200)) body = [MOVE, CARRY];
	    res = spawn.createLongestCreep(body, 'Worker', {role: 'Pickup'}, num_pickup/5 + 2);
	    //console.log((num_pickup+100)/(spawn.memory.max.worker+200))
    }
    //console.log("1: " + res);
    //console.log(typeof res != 'string' && num_miner < spawn.memory.max.miner);
    
    if(typeof res != 'string' && num_miner < spawn.memory.max.miner) {
	    var body = [MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK];
	    res = spawn.createLongestCreep(body, 'Head', {role: 'Head'});
	}
	//console.log("2: " + res);
    if(typeof res != 'string' && num_tail < spawn.memory.max.tail) {
	    var body = [MOVE, CARRY, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK]
	    if(Math.random() > (num_tail+7)/(spawn.memory.max.tail+7)) body = [MOVE, CARRY, WORK, WORK, MOVE, MOVE, CARRY, WORK, WORK, MOVE, MOVE, CARRY, WORK, WORK, MOVE, MOVE, CARRY, WORK, WORK, MOVE, MOVE, CARRY, WORK, WORK, MOVE]
	    res = spawn.createLongestCreep(body, 'Tail', {role: 'Tail'});
    }
    //console.log("3: " + res);
    if(typeof res == 'string') {
    	Memory.creeps[res].ids = {spawn: this.id};
    	console.log(res + " has been created");
    }
	
}

var dropped_energy = Game.spawns.Spawn1.room.find(FIND_DROPPED_ENERGY);

var deposit_targets = [];
if(Game.spawns.Spawn1.energy < Game.spawns.Spawn1.energyCapacity) {
    deposit_targets.push([Game.spawns.Spawn1])
}
var extensions = Game.spawns.Spawn1.room.find(FIND_MY_STRUCTURES, {
    filter: { structureType: STRUCTURE_EXTENSION }
});
deposit_targets.push([])
for(ext in extensions) {
    if(extensions[ext].energy < extensions[ext].energyCapacity) {
        _.last(deposit_targets).push(extensions[ext]);
    }
}

deposit_targets.push([])
var creep_list = [];
var closest_creep = {dist: 100};
for(creep in Game.creeps) {
    var creep = Game.creeps[creep];

    if(creep.ticksToLive < 5) {
        creep.unclaimAll();
        creep.dropEnergy();
        creep.suicide();
        delete creep.memory;
        console.log(creep.name +' died')
    }
    if(_.startsWith(creep.name, 'Tail')) {
        creep.role = 'Tail';
        creep.Tail();
        //creep.moveTo(creep.room.controller);
	    //creep.upgradeController(creep.room.controller);
	    _.last(deposit_targets).push(creep);
    }
    
    else if(_.startsWith(creep.name, 'Head')) {
        if(creep.target == null) {
            var possibe = []
            for(var room in Game.rooms) {
                room = Game.rooms[room];
                var targets = room.find(FIND_SOURCES);
                for(var target in targets){
                    target = targets[target];
                    var near_target = room.lookForAtArea('creep', target.pos.y-1, target.pos.x-1, target.pos.y+1, target.pos.x+1);
                    var count = 0;
                    for(var j in near_target) {
                        for(var k in near_target[j]) {
                            if(near_target[j][k] != undefined && near_target[j][k][0].memory.role == 'Head') {
                                count++
                            }
                        }
                    }
                    if(count < 3) {
                        possibe.push(target);
                    }
                }
            }
            var rng = Math.floor(Math.random()*possibe.length)
            creep.target = possibe[rng];
        }
        creep.role = 'Head';
        //var target = creep.pos.findClosestByRange(FIND_SOURCES);
        //var pos = Game.flags['Head'].pos;
        creep.moveTo(creep.target);
        //var found = pos.lookFor('source');
        creep.harvest(creep.target);
    }
    else if(_.startsWith(creep.name, 'Work')) {
        creep.role = 'Work';
        //creep.target = null;
        creep_list.push(creep);
        var closest = creep.pos.findClosestByRange(deposit_targets[0]);
        var dist = creep.pos.getRangeTo(deposit_targets[0])
        if(dist < closest_creep.dist) {
            closest_creep.dist = dist;
            closest_creep.creep = creep;
        }
    }
}

var last_flag = {num: 0};
for(flag in Game.flags) {
    flag = Game.flags[flag];
    if(_.startsWith(flag.name, 'Dest')) {
        var near_flag = flag.room.lookForAtArea('creep', flag.pos.y-1, flag.pos.x-1, flag.pos.y+1, flag.pos.x+1);
        flag.setColor(COLOR_RED);
        for(j in near_flag) {
            for(k in near_flag[j]) {
                if(near_flag[j][k] != undefined && near_flag[j][k][0].memory.role == 'Work') flag.setColor(COLOR_GREEN);
            }
        }
        if(flag.color == COLOR_RED) deposit_targets.push(flag);
        
        var num = _.words(flag.name)[1]
        if(num > last_flag.num) {
            last_flag.flag = flag;
            last_flag.num = num;
        }
    }
}
var new_deposit_targets = []
for(var target_group in deposit_targets) {
    new_deposit_targets.push([])
    for(target in deposit_targets[target_group]) {
        target = deposit_targets[target_group][target];
        var near_target = target.room.lookForAtArea('creep', target.pos.y-1, target.pos.x-1, target.pos.y+1, target.pos.x+1);
        var done = false;
        for(j in near_target) {
            for(k in near_target[j]) {
                if(near_target[j][k] != undefined && near_target[j][k][0].memory.role == 'Work' && near_target[j][k][0].energy > 10) {
                    near_target[j][k][0].target = target;
                    near_target[j][k][0].transferEnergy(target);
                    done = true;
                    break;
                }
                if(done) break;
            }
            if(done) break;
        }
        if(!done) _.last(new_deposit_targets).push(target);
    }
    if(_.last(new_deposit_targets).length == 0) new_deposit_targets.pop();
}
//console.log(deposit_targets)
deposit_targets = new_deposit_targets;
//console.log(deposit_targets[0])

var last_creep = creep_list[creep_list.length-1];
for(i in creep_list) {
    i = parseInt(i);
    //creep.say(i);
    //if(Game.time % 2 == i % 2) continue;
    var creep = creep_list[i];
    var next_creep = creep_list[i+1];
    var prev_creep = creep_list[i-1];
    //console.log((i+1) + ' ' + creep_list[i+1] + ' ' + next_creep)
    //console.log((i-1) + ' ' + creep_list[i-1] + ' ' + prev_creep)
    if(creep.memory.last === undefined) creep.memory.last = {};
    if(creep.memory.last.pos === undefined) creep.memory.last.pos = {};
    
    if(creep.pos.x == creep.memory.last.pos.x && creep.pos.y == creep.memory.last.pos.y && creep.memory.last.energy == creep.energy) {
        if(creep.memory.stuck === undefined) creep.memory.stuck = 0;
        creep.memory.stuck++;
        if(creep.memory.stuck > 50) {
            Memory.data.stuck = true;
            creep.say('Stuck');
            creep.memory.stuck = 0;
        }
    }
    else {
        creep.memory.stuck = 0;
    }
    creep.memory.last.pos = creep.pos;
    creep.memory.last.energy = creep.energy;
    
    if(i <= 1) {
        if(creep.spawn === undefined || creep.spawn === null) creep.spawn = creep.pos.findClosestByRange(FIND_MY_SPAWNS);
        if(creep.spawn === undefined || creep.spawn === null) creep.spawn = Game.spawns.Spawn1;
        //creep.spawn = '55d21ac8bbc786b40f59f8fa'
        var closest = creep.spawn.pos.findClosestByRange(dropped_energy);
        creep.moveTo(closest);
        creep.pickup(closest);
        if(dropped_energy.length > 1) {
            var index = dropped_energy.indexOf(closest);
            dropped_energy.splice(index, 1);
        }
        creep.transferEnergy(next_creep);
    }
    else if(next_creep == undefined || next_creep.spawning) {
        creep.say('H');
        
        //creep.log(creep.target);
        //creep.log(creep.carry.energy +' '+ creep.carryCapacity);
        //creep.target = creep.pos.findClosestByRange(deposit_targets[0]);
        
        //if(Game.time % 100 == 0) creep.target = creep.pos.findClosestByRange(deposit_targets[0]);
        /*if(creep.memory)
        if(Game.time % 25 == 0 || creep.target == null) {
            creep.target = deposit_targets[0][Math.floor(Math.random()*deposit_targets[0].length)];
            creep.log('Target: ' + creep.target);
        }*/
        
        if(creep.memory.time === undefined) creep.memory.time = 0;
    	if(creep.target === undefined || creep.target === null || Game.time - creep.memory.time >= Math.random()*25 + 25) {
    	    creep.memory.time = Game.time;
    	    creep.target = deposit_targets[0][Math.floor(Math.random()*deposit_targets[0].length)];
    	    creep.log('Target: ' + creep.target + ' ' + (creep.target === undefined));
    	}
        
        //creep.log(creep.target.name +': '+deposit_targets[0][Math.floor(Math.random()*deposit_targets[0].length)])
        /*var flag_name = creep.name.substring(13) + "_Target";
        //Game.flags[flag_name].remove();
        for(i in Game.flags) {
            if(_.startsWith(Game.flags[i].name, flag_name)) Game.flags[i].remove();
        }*/
        //if(creep.target != null) creep.room.createFlag(creep.target.pos, creep.name.substring(13) + "_Target");
        
        /*if(creep.carry.energy >= creep.carryCapacity) {
            creep.spawn = creep.pos.findClosestByRange(FIND_MY_SPAWNS);
            creep.target = deposit_targets[0];
            
        }*/
        if(creep.carry.energy <= 0 && !creep.pos.isNearTo(prev_creep)) {
            creep.moveTo(prev_creep)
        }
        else {
            creep.moveTo(creep.target);
            var err = creep.transferEnergy(creep.target);
            if(err == ERR_INVALID_TARGET || err == ERR_FULL) creep.target = null;
            //creep.say(creep.carry.energy)
        }
        //creep.log(creep.target);
        //creep.log(creep.transferEnergy(creep.target));
        //creep.log(creep.target)
    }
    else {
        //creep.say(creep.carry.energy < creep.carryCapacity)
        var is_near_next = creep.pos.isNearTo(next_creep);
        var is_near_prev = creep.pos.isNearTo(prev_creep);
        var low_energy = creep.carry.energy < creep.carryCapacity;
        var high_energy = creep.carry.energy >= creep.carryCapacity;
        //creep.say('x');
        //if(creep.carry.energy < creep.carryCapacity) creep.moveTo(prev_creep);
        //else if(creep.carry.energy > 0 && !is_near_next) creep.moveTo(next_creep);
        
        if(creep.target != null) {
            creep.transferEnergy(creep.target);
            if(Math.random() > .5) creep.moveTo(creep.target);
        }
        
        
        if(low_energy) {
            if(is_near_prev) prev_creep.transferEnergy(creep);
            else creep.moveTo(prev_creep);
        }
        else if (high_energy) {
             if(is_near_next) creep.transferEnergy(next_creep);
            else creep.moveTo(next_creep);
        }
        //if(!is_near_next && (Game.time % 3 != i % 3)) creep.moveTo(next_creep);
        //if(creep.carry.energy < creep.carryCapacity && !is_near_prev) creep.moveTo(prev_creep);
        //if(!is_near_prev) creep.moveTo(prev_creep);
        //if(!is_near_prev) creep.moveTo(prev_creep);

        //if(prev_creep.carry.energy >= prev_creep.carryCapacity/2 && !is_near_prev) creep.moveTo(prev_creep);
        //if(creep.carry.energy >= creep.carryCapacity && !is_near_next) creep.moveTo(next_creep);
        
        //if(creep.carry.energy >= creep.carryCapacity && is_near_next) creep.cancelOrder('move');
        //if(creep.carry.energy < creep.carryCapacity && is_near_prev) creep.cancelOrder('move');
        
        if(is_near_next && is_near_prev) {
            //creep.say('x');
            
        }
        //creep.say(last_worker.transferEnergy(creep));
        
        var all_target = [];
        for(i in deposit_targets) {
            for(j in deposit_targets[i]) {
                all_target.push(deposit_targets[i][j]);
            }
        }
        var near_target = creep.pos.findClosestByRange(all_target);
        
        if(creep.pos.isNearTo(near_target)) {
            creep.transferEnergy(near_target);
            //creep.say('x');
        }
        else {
            //if(prev_creep instanceof Creep) prev_creep.transferEnergy(creep);
            creep.transferEnergy(next_creep)
        }
        
        var near_energy = creep.room.lookForAtArea('energy', creep.pos.y-1, creep.pos.x-1, creep.pos.y+1, creep.pos.x+1);
        
        for(j in near_energy) {
            for(k in near_energy[j]) {
                if(near_energy[j][k] != undefined) creep.pickup(near_energy[j][k][0]);
            }
        }
        
        //if(err) creep.say(err);
        //creep.say(creep.carry.energy)
    }
    var near_source = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
    var source_dist = creep.pos.getRangeTo(near_source);
    var control_dist = creep.pos.getRangeTo(creep.room.controller);
    
    if(source_dist <= 1 || control_dist <= 1) creep.say('?')
    if(Memory.data.stuck == true || source_dist <= 1 || control_dist <= 1) {
        creep.move(Math.floor(Math.random()*8)+1);
        //creep.say('unstuck');
        creep.memory.stuck /= 2;
    }
    
}

if(closest_creep.creep) closest_creep.creep.moveTo(deposit_targets[0][0]);
if(Memory.data === undefined) Memory.data = {};
Memory.data.stuck = false;
//var creep = creep_list[creep_list.length-1];


/*creep = first_worker;
var closest = creep.spawn.pos.findClosestByRange(FIND_DROPPED_ENERGY);
creep.moveTo(closest);
creep.pickup(closest);*/





/*
require('Room');
require('Spawn');
require('Creep');

var Util = require('Util');

Util.setUp(Memory, 'global.roles.Head.valid_targets');
Util.setUp(Memory, 'global.roles.Tail.valid_targets');
if(Game.time % 200 == 0) Util.syncCreeps();
if(Game.time % 2000 == 0) {
    delete Memory.data;
    for(i in Memory.rooms) {
        delete i.map;
    }
    console.log('Deleting Memory')
}
if(Memory.data == undefined) Memory.data = {};

var spawn_count = 0;
for(spawn in Game.spawns) {
	var res = false;
	spawn_count++;
	//console.log(Game.time % (3 * Object.keys(Game.creeps).length + Object.keys(Game.spawns).length + 1));
	var spawn = Game.spawns[spawn];
	if(spawn.room.energyAvailable >= spawn.room.energyCapacityAvailable) {
	    
	}
	else if((Game.time % (3 * Object.keys(Game.creeps).length + Object.keys(Game.spawns).length + 1)) != spawn_count) continue;
    
    
    

    if(Game.time % 20 ==13) console.log('Miners: ' + num_miner + ' Workers: ' + num_pickup + ' Tails: ' + num_tail);
    
    if(Object.keys(Game.creeps).length < 4) {
	    res = spawn.createWorkerCreep([WORK, MOVE], 'Worker 0', {role: 'Head'});
	    if(typeof res != 'string') {
	    	res = spawn.createWorkerCreep([CARRY, MOVE], 'Worker 1', {role: 'Pickup'});
	    }
	}
	console.log('Heads: ' + num_miner + ' Mover' + num_pickup + ' Tails' + num_tail)

    if(spawn.memory.max == undefined) spawn.memory.max == {};
    if(spawn.memory.max['Head'] == undefined) spawn.memory.max['Head'] == 3;
    if(spawn.memory.max['Worker'] == undefined) spawn.memory.max['Worker'] == 6;
    if(spawn.memory.max['Tail'] == undefined) spawn.memory.max['Tail'] == 2;
    
    
    if(typeof res != 'string' && num_pickup < spawn.memory.max.worker && (num_miner > num_pickup || num_miner >= spawn.memory.max.miner)&& (num_tail > num_pickup || num_tail >= spawn.memory.max.tail)) {
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
    	Memory.creeps[res].ids = {spawn: this.id};
    	console.log(res + " has been created");
    }
    
    spawn.pos.mark();
    
}

for(creep in Game.creeps) {
    var creep = Game.creeps[creep];
    if(creep.memory.ids === undefined || creep.memory.ids.spawn === undefined) {
        creep.memory = {}
        creep.memory.ids = {spawn: '55d21ac8bbc786b40f59f8fa'};
    }
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
*/
