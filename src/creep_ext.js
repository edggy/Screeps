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
        this.suicide();
        console.log(this.name + ' died');
    }
    if(this.memory.role == undefined) this.memory.role = '';
    if(this.memory.role.toUpperCase() == 'pickup'.toUpperCase()){
    	if(this.carry.energy >= this.carryCapacity) {
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
                for(i in ene) {
                    if(ene[i].energy > 0) {
                        targets.push(ene[i]);
                    }
                }
                if(targets.length && this.memory.target == null) {
                	this.memory.target = targets[Math.floor(targets.length * Math.random())].id;
                	this.memory.type = 'energy';
                }
                else if(targets.length){
                	this.memory.target = this.pos.findClosest(targets).id;
                	this.memory.type = 'energy';
                }
            }
            
            var target = Game.getObjectById(this.memory.target);
            //console.log(this.memory.target + " " + target);
            if(target == null) {
                this.memory.target = 'gone';
            }
            else {
                target.pos.mark();
                //this.say(this.pos.distTo(target)/2);
                this.moveTo(target);
                if(this.memory.last_mine === undefined) this.memory.last_action = 0;
                if(this.pickup(target) == 0) {
                	this.memory.last_action = 0;
                }
                else this.memory.last_action++;
                if(this.memory.last_action > 50) {
                	this.memory.target == null;
                }
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
                        if(targets.length) {
                            this.memory.target = this.pos.findClosest(targets).id;
                            this.memory.type = 'build';
                        }
                        else {
                            
                            this.memory.target = Game.getObjectById('55c34a6c5be41a0a6e80c903').id;
                            this.memory.type = 'upgradeController';
                        }
                    }
                }
            }
            var target = Game.getObjectById(this.memory.target);
            if(target == null) {
                this.memory.target = null;
            }
            else {
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
                else if(this.memory.type === 'upgradeController') this.upgradeController(target);
                if(this.carry.energy <= 1) {
                    this.memory.state = 'pickup';
                    this.memory.target = null;
                }
                //this.say(this.pos.distTo(target)/2);
            }
        }
        else {
        	this.memory.state = 'pickup';
        }
        if(this.memory.verbose && target != null) this.say(this.pos.distTo(target)/2 + ' ' + this.pos.dirTo(target));
    }
    else if(this.getActiveBodyparts(WORK) > 0) {
        if(this.memory.target === undefined) this.memory.target = '55c34a6c5be41a0a6e80c904';
        if(this.memory.last_mine === undefined) this.memory.last_mine = 0;
        var target = Game.getObjectById(this.memory.target)
        //if(this.carry.energy < this.carryCapacity) {
            target = Game.getObjectById(this.memory.target)
            this.moveTo(target);
            if(this.harvest(target) == 0) {
            	this.memory.state = 'Mining';
            	this.memory.last_mine = 0;
            }
            else this.memory.last_mine++;
            this.dropEnergy();
            
            if(this.memory.last_mine > 100) {
            	var sources = this.room.find(FIND_SOURCES_ACTIVE);
            	var targets = [];
            	for(i in sources) {
                    if(sources[i].id != this.memory.target) {
                        targets.push(sources[i]);
                    }
                }
                if(targets.length) {
                    this.memory.target = this.pos.findClosest(targets).id;
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
