//creep_ext
/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('creep_ext'); // -> 'a thing'
 */
 
require('RoomPosition');
require('Creep_Tail');
require('Creep_Head');
var Util = require('Util');

Creep.prototype.tick = function() {
	this.setUp();
    if(this.ticksToLive < 5) {
        this.dropEnergy();
        this.unclaimAll();
        this.suicide();
        console.log(this.name + ' died');
    }
    if(this.memory.role == undefined) this.memory.role = '';
    if(this.Tail()) {
    /*if(this.memory.role.toUpperCase() == 'tail'.toUpperCase()){
    	this.memory.target = Game.getObjectById(this.memory.spawn).room.controller.id;
    	
    	var targets = Game.spawns.Spawn1.room.find(FIND_CONSTRUCTION_SITES);
        if(targets.length) {
            this.memory.target = this.pos.findClosest(targets).id;
            if(this.memory.target == undefined) this.memory.target = this.pos.findClosestByRange(targets).id;
            this.memory.type = 'build';
        } 
        else {
            this.memory.target = Game.getObjectById(this.memory.spawn).room.controller.id;
            this.memory.type = 'upgradeController';
        }
    	var target = Game.getObjectById(this.memory.target);
    	target.pos.mark();
        
        this.moveTo(target);
        if(this.memory.last_action === undefined) this.memory.last_action = 0;
        if(this.memory.type = 'upgradeController' && this.upgradeController(target) == 0) {
        	this.memory.last_action = 0;
        }
        else if(this.memory.type = 'build' && this.build(target) == 0) {
        	this.memory.last_action = 0;
        }
        else this.memory.last_action++;
        //if(this.memory.last_action > this.pos.getRangeTo(target)*3) {
    	//var dir = this.pos.getDirectionTo(target);
    	//var spot = this.pos.look(dir);
    	//var creep = this.room.lookForAt('creep', spot);
    	//if(creep.length) {
    	//	this.transferEnergy(creep[0]);
    	//}
    	var dir = this.pos.getDirectionTo(target);
    	//var spot = this.pos.look(dir);
    	var creep = [];
    	for(var i = -2; i <= 2; i++) {
    	    var creep_at = this.room.lookForAt('creep', this.pos.look((dir+i+8)%8))[0];
            if(creep_at != undefined) creep.push(creep_at);
    	}
    	if(creep.length) {
    		this.transferEnergy(creep[0]);
    	}
        //}*/
    }
    else if(this.Head()) {
    }
    else if(this.memory.role.toUpperCase() == 'pickup'.toUpperCase()){
    	if(this.carry.energy >= this.carryCapacity || (!this.room.find(FIND_SOURCES_ACTIVE).length && !this.room.find(FIND_DROPPED_ENERGY).length)) {
    	    this.unclaim(this.memory.target);
            this.memory.state = 'deliver';
            this.memory.target = null;
            this.memory.type = null;
        }
        var targets = [];
        if(this.memory.state === undefined) this.memory.state = 'pickup';
        if(this.memory.target === undefined) this.memory.target = null;
        if(this.memory.type === undefined) this.memory.type = null;
        if(this.memory.state == 'pickup') {
            if(this.memory.target == null || this.memory.target == 'gone') {
                var targets = [];
                var ene = this.room.find(FIND_DROPPED_ENERGY);
                var least = {};
                least.claims = 1000;
                least.id = [];
                for(i in ene) {
                    if(ene[i].energy > 0) {
                        targets.push(ene[i]);
                        var num_claims = 0;
                        if(Memory.data[ene[i].id] == undefined) Memory.data[ene[i].id] = {};
                        if(Memory.data[ene[i].id].claims != undefined) num_claims = Object.keys(Memory.data[ene[i].id].claims).length;
                        if(num_claims == undefined) {
                            if(least.claims == 0) {
                                least.id.push(ene[i].id);
                            }
                            else {
                                least.claims = 0;
                                least.id = [ene[i].id];
                            }
                        }
                        else if(num_claims < least.claims) {
                            least.claims = num_claims;
                            least.id = [ene[i].id];
                        }
                        else if(num_claims == least.claims) {
                            least.id.push(ene[i].id);
                        }
                    }
                }
                if(least.id.length) {
                    
                    this.memory.target = least.id[Math.floor(least.id.length * Math.random())];
                    //this.log(this.memory.target);
                    this.claim(this.memory.target);
                }
                /*if(targets.length && this.memory.target == null) {
                	this.memory.target = targets[Math.floor(targets.length * Math.random())].id;
                	this.memory.type = 'energy';
                }
                else if(targets.length){
                	//this.memory.target = this.pos.findClosest(targets).id;
                	this.memory.target = targets[Math.floor(targets.length * Math.random())].id;
                	this.memory.type = 'energy';
                }*/
            }
            
            var target = Game.getObjectById(this.memory.target);
            this.feedAway();
            //console.log(this.memory.target + " " + target);
            if(target == null) {
                this.unclaim(this.memory.target);
                this.memory.target = 'gone';
            }
            else {
                target.pos.mark();
                //this.say(this.pos.distTo(target)/2);
                this.moveTo(target);
                if(this.memory.last_action === undefined) this.memory.last_action = 0;
                if(this.pickup(target) == 0) {
                	this.memory.last_action = 0;
                }
                else this.memory.last_action++;
                if(this.memory.last_action > 50 + this.pos.distTo(target)/2) {
                    this.unclaim(this.memory.target);
                	this.memory.target == null;
                }
            }
            
            /*var dir = this.pos.getDirectionTo(target);
        	//var spot = this.pos.look(dir);
        	var creep = [];
        	var most_energy = this.energy;;
        	for(var i = 1; i < 8; i++) {
        	    //var creep_at = this.room.lookForAt('creep', this.pos.look((dir+i+4)%8))[0];
        	    var creep_at = this.room.lookForAt('creep', this.pos.look(i))[0];
                if(creep_at != undefined && creep.energy > most_energy) {
                    creep = creep_at;
                    most_energy = creep.energy;
                }
        	}
        	this.transferEnergy(creep);*/
        	//creep.push(this.room.lookForAt('creep', this.pos.look(dir+1)));
            //creep.push(this.room.lookForAt('creep', this.pos.look(dir-1)));
        	//if(creep.length) {
        	//	this.transferEnergy(creep[0]);
        	//}
            
        }
        else if(this.memory.state == 'deliver') {
        	if(this.carry.energy <= 1) {
                this.memory.state = 'pickup';
                this.memory.target = null;
                this.memory.type = null;
            }
            if(this.memory.target == null) {
                //if(false && !Game.spawns.Spawn1.isFull()) {
                if(false){
                    this.memory.target = Game.spawns.Spawn1.id;
                    this.memory.type = 'transferEnergy';
                }
                else {
                    var targets = [];
                    if(!this.spawn.isFull()) targets.push(this.spawn);
                    var extensions = Game.spawns.Spawn1.room.find(FIND_MY_STRUCTURES, {
                        filter: { structureType: STRUCTURE_EXTENSION }
                    });
                    for(i in extensions) {
                        if(extensions[i].energy < extensions[i].energyCapacity) {
                            targets.push(extensions[i]);
                        }
                    }
                    if(targets.length) {
                        this.memory.target = this.pos.findClosest(targets).id;
                        this.memory.type = 'transferEnergy';
                    }
                    else {
                        var targets = Game.spawns.Spawn1.room.find(FIND_CONSTRUCTION_SITES);
                        if(targets.length && this.getActiveBodyparts(WORK) > 0) {
                            this.memory.target = this.pos.findClosest(targets).id;
                            this.memory.type = 'build';
                        }
                        else {
                            
                            var targets = [];
                            var tails = Game.spawns.Spawn1.room.find(FIND_MY_CREEPS);//_(Game.creeps).filter( { memory: { role: 'Tail' } } );
                            for(i in tails) {
                                //console.log(tails[i].memory.role);
                                if(tails[i].memory.role == 'Tail') targets.push(tails[i]);
                            }
                            if(targets.length) {
                                //this.memory.target = this.pos.findClosest(targets).id;
                                this.memory.target = targets[Math.floor(targets.length * Math.random())].id;
                                this.memory.type = 'transferEnergy';
                                
                            } 
                            else if(this.getActiveBodyparts(WORK) > 0){
                                
                                this.memory.target = Game.getObjectById('55c34a6c5be41a0a6e80c903').id;
                                this.memory.type = 'upgradeController';
                            }
                            else {
                                
                            }
                        }
                    }
                }
            }
            var target = Game.getObjectById(this.memory.target);
            this.feedTo();
            if(target == null) {
                this.memory.target = null;
            }
            else {
                //console.log('Target: ' + target);
                target.pos.mark();
                
                this.moveTo(target);
                if(this.memory.type === 'transferEnergy') {
                    this.transferEnergy(target); 
                    if(target.energy >= target.energyCapacity) {
                        this.memory.target = null;
                    }
                }
                else if(this.memory.type === 'build') {
                    this.build(target); 
                    if(target.progress >= target.progressTotal) {
                        this.memory.target = null;
                    }
                }
                else if(this.memory.type === 'upgradeController') {
                	if(this.memory.last_action === undefined) this.memory.last_action = 0;
                    if(this.upgradeController(target) == 0) {
                    	this.memory.last_action = 0;
                    }
                    else this.memory.last_action++;
                    //if(this.memory.last_action > this.pos.getRangeTo(target)*3) {
                	/*var dir = this.pos.getDirectionTo(target);
                	//var spot = this.pos.look(dir);
                	//var creep = this.room.lookForAt('creep', spot);
                	//creep.push(this.room.lookForAt('creep', this.pos.look(dir+1)));
                	//creep.push(this.room.lookForAt('creep', this.pos.look(dir-1)));
                	var creep = [];
                	for(var i = -2; i < 2; i++) {
                	    var creep_at = this.room.lookForAt('creep', this.pos.look((dir+i+8)%8))[0];
                        if(creep_at != undefined) creep.push(creep_at);
                	}
                	if(creep.length) {
                		this.transferEnergy(creep[0]);
                	}
                    //}*/
                }
                if(this.carry.energy <= 1) {
                    this.memory.state = 'pickup';
                    this.memory.target = null;
                }
                
                //this.say(this.pos.distTo(target)/2);
                /*var dir = this.pos.getDirectionTo(target);
            	//var spot = this.pos.look(dir);
            	var creep = [];
            	var closest = this.pos.getRangeTo(this.target);
            	for(var i = -2; i <= 2; i++) {
            	    var creep_at = this.room.lookForAt('creep', this.pos.look((dir+i+8)%8))[0];
                    if(creep_at != undefined && creep_at.pos.getRangeTo(this.target) < closest) {
                        creep = creep_at;
                        closest = creep_at.pos.getRangeTo(this.target);
                    }
            	}
            	//if(creep.length) {
            	this.transferEnergy(creep);
            	//}*/
            }
        }
        else {
        	this.memory.state = 'pickup';
        }
        if(this.memory.verbose && target != null) this.say(this.pos.distTo(target)/2 + ' ' + this.pos.dirTo(target));
    }
    else {
        this.target = null;
        if(_.startsWith(this.name, 'Tail')) this.role = 'Tail';
        if(_.startsWith(this.name, 'Head')) this.role = 'Head';
        //Pickup
        if(_.startsWith(this.name, 'Worker')) this.role = 'Pickup';
        this.target = null;
    }
    /*else if(this.getActiveBodyparts(WORK) > 0) {
        this.target = null;
        if(this.memory.target === undefined) {
            this.memory.target = null;
        }
        if(this.memory.last_mine === undefined) this.memory.last_mine = 0;
        if(this.memory.target == null || this.memory.state == 'Waiting') {

            var sources = this.room.find(FIND_SOURCES);
        	var targets = [];
        	for(i in sources) {
                if(sources[i].id != this.memory.target) {
                    if(this.canClaim(sources[i].id, 2)) targets.push(sources[i]);
                }
            }
            if(targets.length) {
                var tries = 0;
                var index = Math.floor(targets.length * Math.random());
                this.memory.target = targets[index].id;
                while(this.canClaim(this.memory.target, 2) && tries < targets.length) {
                    tries++;
                    this.memory.target = targets[(index + tries)%targets.length].id;
                    
                }
                //this.memory.target = this.pos.findClosest(targets).id;
                this.memory.last_mine = 0;
            } 
        }
        var target = Game.getObjectById(this.memory.target);
        //if(this.carry.energy < this.carryCapacity) {
        //target = Game.getObjectById(this.memory.target)
        this.moveTo(target);
        if(this.harvest(target) == 0) {
        	this.memory.state = 'Mining';
        	this.memory.last_mine = 0;
        }
        else this.memory.last_mine++;
        this.dropEnergy();
        
        if(this.memory.last_mine > 50 + this.pos.getRangeTo(target)*this.getActiveBodyparts(WORK)) {
        	var sources = this.room.find(FIND_SOURCES_ACTIVE);
        	var targets = [];
        	for(i in sources) {
                if(sources[i].id != this.memory.target) {
                    if(this.canClaim(sources[i].id, 2)) targets.push(sources[i]);
                }
            }
            if(targets.length) {
                this.unclaim(this.memory.target);
                this.memory.target = this.pos.findClosest(targets).id;
                this.claim(this.memory.target);
                this.memory.last_mine = 0;
            } 
            else {
            	this.memory.target = this.room.find(FIND_FLAGS, {
            	    filter: { name: 'Wait' }
            	})[0].id;
            	this.memory.state = 'Waiting';
            }
        }
        /*}
        else if(Game.getObjectById('55cfc833da0f8b800f00507d').energy >= Game.getObjectById('55cfc833da0f8b800f00507d').energyCapacity) {
            target = Game.getObjectById('55c34a6c5be41a0a6e80c903')
            this.moveTo(target);
            this.upgradeController(target);
        }
        else {
            target = Game.getObjectById('55cfc833da0f8b800f00507d')
            this.moveTo(target);
            this.transferEnergy(target);
        }
        //this.say(this.pos.distTo(target)/2
    }*/
    
}

/*Creep.prototype.moveTo = function(target) {
    target.pos.mark();
    var dist = this.pos.distTo(target);
    var dir = this.pos.dirTo(target);
    this.move(dir);
    //this.say(dist/2 + ' ' + dir);
}*/

Creep.prototype.setTarget = function(targets, limit) {
	limit = limit || 1;
	if(Util.isValid(targets)) targets = [targets];
	targets = Util.toIds(targets);
	for(i in targets) {
		cur_target = targets[i];
		if(Util.isValid(cur_target)) cur_target = cur_target.id;
		if(!Util.isValidId(cur_target)) return undefined;
		
		if(this.claimed(cur_target)) return true;
		if(this.canClaim(cur_target, limit)) {
		    
			this.claim(cur_target);
			this.log(cur_target)
			this.log(this.unclaim(this.memory.ids.target));
			this.memory.ids.target = cur_target;
			return true;
		}
	}
	return false;
}

Creep.prototype.log = function(string) {
    console.log(this.name + ": " + string);
}

Creep.prototype.claim = function(target) {
    if(Util.isValid(target)) target = target.id;
    else if(!Util.isValidId(target)) return undefined;
    
    if(!Util.isValid(target)) return undefined;
    if(Memory.data[target] == undefined) Memory.data[target] = {};
    if(Memory.data[target].claims == undefined) Memory.data[target].claims = {};
    if(this.memory.claims == undefined) this.memory.claims = {};
    
    this.memory.claims[target] = true;
    Memory.data[target].claims[this.id] = true;

    console.log('claiming ' + Memory.data[target].claims[this.id])
    return Object.keys(Memory.data[target].claims).length;
}

Creep.prototype.unclaim = function(target) {
    //if(!Util.isValid(target)) return undefined;
    if(Util.isValid(target)) target = target.id;
    else if(!Util.isValidId(target)) return undefined;
    
    if(Memory.data[target] == undefined) Memory.data[target] = {};
    if(Memory.data[target].claims == undefined) Memory.data[target].claims = {};
    if(this.memory.claims == undefined) this.memory.claims = {};
    
    
    if(!this.claimed(target)) return undefined
    delete this.memory.claims[target];
    
    console.log('deleting ' + Memory.data[target].claims[this.id])
    delete Memory.data[target].claims[this.id];
    if(Object.keys(Memory.data[target].claims).length == 0) {
        delete Memory.data[target].claims;
        if(Object.keys(Memory.data[target]).length == 0) delete Memory.data[target];
        return 0;
    }
    return Object.keys(Memory.data[target].claims).length;
}

Creep.prototype.unclaimAll = function() {
    
    for(var i in this.memory.claims) {
        this.unclaim(i);
        if(Memory.data[i].claims != undefined && Object.keys(Memory.data[i].claims).length == 0) delete Memory.data[i].claims;
    }
}

Creep.prototype.canClaim = function(target, num) {
    this.log(target)
    if(Util.isValid(target)) target = target.id;
    else if(!Util.isValidId(target)) return undefined;
    if(Memory.data[target] === undefined) return num > 0;
    if(Memory.data[target].claims === undefined) return num > 0;
    
    return Object.keys(Memory.data[target].claims).length < num;
}

Creep.prototype.claimed = function(target) {
    if(Util.isValid(target)) target = target.id;
    else if(!Util.isValidId(target)) return undefined;
    
    if(this.memory.claims == undefined) this.memory.claims = {};
    if(target === undefined || target === null) return undefined;
    return (target in this.memory.claims);
}

Creep.prototype.feed = function(dir, spread) {
	dir = dir || TOP;
	spread = spread || 2
	for(var i = -spread; i <= spread; i++) {
	    var creep_at = this.room.lookForAt('creep', this.pos.look((dir+i+16)%8))[0];
        if(creep_at != undefined) {
        	this.transferEnergy(creep_at);
        	break;
        }
	}
}

Creep.prototype.feedAway = function() {
    if(this.energy <= 1) return;
    this.target = this.memory.target
    var creeps = this.room.lookForAtArea('creep', this.pos.y-1, this.pos.x-1, this.pos.y+1, this.pos.x+1);
    var max_dist = this.pos.getRangeTo(this.target);
    var best_creep = this;
    var energy = 0;
    for(i in creeps) {
        for(j in creeps[i]) {
            var cur_creep = creeps[i][j][0];
            if(cur_creep != undefined && cur_creep.pos.getRangeTo(cur_creep.memory.target) > max_dist && cur_creep.energy < cur_creep.carryCapacity&& cur_creep.carryCapacity > energy) {
                max_dist = cur_creep.pos.getRangeTo(cur_creep.memory.target);
                min_energy = cur_creep.carryCapacity;
                best_creep = cur_creep;
            }
        }
    }
    return this.transferEnergy(best_creep);
}

Creep.prototype.feedTo = function() {
    if(this.energy <= 1) return;
    this.target = this.memory.target
    var creeps = this.room.lookForAtArea('creep', this.pos.y-1, this.pos.x-1, this.pos.y+1, this.pos.x+1);
    var min_dist = this.pos.getRangeTo(this.target);
    var best_creep = this;
    var energy = 0;
    for(i in creeps) {
        for(j in creeps[i]) {
            var cur_creep = creeps[i][j][0];
            //console.log(this.transferEnergy(cur_creep));
            if(cur_creep != undefined && cur_creep.pos.getRangeTo(cur_creep.memory.target) <= min_dist && cur_creep.energy < cur_creep.carryCapacity && cur_creep.carryCapacity > energy) {
                min_dist = cur_creep.pos.getRangeTo(cur_creep.memory.target);
                min_energy = cur_creep.carryCapacity;
                best_creep = cur_creep;
                this.transferEnergy(best_creep);
            }
        }
    }
    //console.log(this.transferEnergy(best_creep))
    return this.transferEnergy(best_creep);
}

Creep.prototype.feedForward = function(dir, spread) {
	dir = dir + this.pos.getDirectionTo(this.target);
	spread = spread || 2
	for(var i = -spread; i <= spread; i++) {
	    var creep_at = this.room.lookForAt('creep', this.pos.look((dir+i+16)%8))[0];
        if(creep_at != undefined) {
        	this.transferEnergy(creep_at);
        	break;
        }
	}
}

Object.defineProperty(Creep.prototype, "role", {
    get: function() {
    	return Memory.global.roles[this.memory.role];
    },
	set: function(value) {
		this.memory.role = value;
	}
});

Object.defineProperty(Creep.prototype, "spawn", {
    get: function() {
    	Util.setUp(this, 'ids');
    	return Game.getObjectById(this.memory.ids.spawn);
    },
	set: function(value) {
		if(Util.isValidId(value)) this.memory.ids.spawn = value;
		else if(Util.isValid(value)) this.memory.ids.spawn = value.id;
	}
});

Object.defineProperty(Creep.prototype, "target", {
    get: function() {
    	//var res = Game.getObjectById(this.memory.ids.target);
    	//if(res === null) return undefined;
    	return Game.getObjectById(this.memory.ids.target);
    },
	set: function(value) {
		if(value == null || Util.isValidId(value)) this.memory.ids.target = value;
		else if(Util.isValid(value)) this.memory.ids.target = value.id;
	}
});

Creep.prototype.setUp = function() {
	Util.setUp(this.memory, 'ids');
	Util.setUp(this.memory, 'claims');
}
