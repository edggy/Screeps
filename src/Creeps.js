//creep_ext
/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('creep_ext'); // -> 'a thing'
 */
 

Creep.prototype.tick = function() {
    if(this.ticksToLive < 5) {
        this.dropEnergy();
        this.unclaimAll();
        this.suicide();
        console.log(this.name + ' died');
    }
    if(this.memory.role == undefined) this.memory.role = '';
    if(this.memory.role.toUpperCase() == 'tail'.toUpperCase()){
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
    	/*var dir = this.pos.getDirectionTo(target);
    	var spot = this.pos.look(dir);
    	var creep = this.room.lookForAt('creep', spot);
    	if(creep.length) {
    		this.transferEnergy(creep[0]);
    	}*/
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
        //}
    }
    else if(this.memory.role.toUpperCase() == 'pickup'.toUpperCase()){
    	if(this.carry.energy >= this.carryCapacity) {
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
                if(this.memory.last_action > 50 +  + this.pos.distTo(target)/2) {
                    this.unclaim(this.memory.target);
                	this.memory.target == null;
                }
            }
            var dir = this.pos.getDirectionTo(target);
        	//var spot = this.pos.look(dir);
        	var creep = [];
        	for(var i = -2; i <= 2; i++) {
        	    var creep_at = this.room.lookForAt('creep', this.pos.look((dir+i+4)%8))[0];
                if(creep_at != undefined) creep.push(creep_at);
        	}
        	//creep.push(this.room.lookForAt('creep', this.pos.look(dir+1)));
            //creep.push(this.room.lookForAt('creep', this.pos.look(dir-1)));
        	if(creep.length) {
        		this.transferEnergy(creep[0]);
        	}
            
        }
        else if(this.memory.state == 'deliver') {
        	if(this.carry.energy <= 1) {
                this.memory.state = 'pickup';
                this.memory.target = null;
                this.memory.type = null;
            }
            if(this.memory.target == null) {
                if(!Game.spawns.Spawn1.isFull()) {
                    this.memory.target = Game.spawns.Spawn1.id;
                    this.memory.type = 'transferEnergy';
                }
                else {
                    var targets = [];
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
            }
        }
        else {
        	this.memory.state = 'pickup';
        }
        if(this.memory.verbose && target != null) this.say(this.pos.distTo(target)/2 + ' ' + this.pos.dirTo(target));
    }
    else if(this.getActiveBodyparts(WORK) > 0) {
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
        }*/
        //this.say(this.pos.distTo(target)/2);
        //this.say(this.pos.distTo(target));
    }
    
}

/*Creep.prototype.moveTo = function(target) {
    target.pos.mark();
    var dist = this.pos.distTo(target);
    var dir = this.pos.dirTo(target);
    this.move(dir);
    //this.say(dist/2 + ' ' + dir);
}*/

Creep.prototype.log = function(string) {
    console.log(this.name + ": " + string);
}

Creep.prototype.claim = function(target) {
    if(Memory.data[target] == undefined) Memory.data[target] = {};
    if(Memory.data[target].claims == undefined) Memory.data[target].claims = {};
    if(this.memory.claims == undefined) this.memory.claims = {};
    
    this.memory.claims[target] = true;
    Memory.data[target].claims[this.id] = true;

    return Object.keys(Memory.data[target].claims).length;
}

Creep.prototype.unclaim = function(target) {
    if(Memory.data[target] == undefined) Memory.data[target] = {};
    if(Memory.data[target].claims == undefined) Memory.data[target].claims = {};
    if(this.memory.claims == undefined) this.memory.claims = {};
    delete this.memory.claims[target];
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
        delete this.memory.claims[i];
        delete Memory.data[i].claims[this.id];
        if(Object.keys(Memory.data[i].claims).length == 0) delete Memory.data[i].claims;
    }
}

Creep.prototype.canClaim = function(target, num) {
    if(Memory.data[target] == undefined || Memory.data[target].claims == undefined) return 0 < num;
    return Object.keys(Memory.data[target].claims).length < num;
}

Creep.prototype.claimed = function(target) {
    return target.id in this.memory.claims;
}
