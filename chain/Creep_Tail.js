/**
 * 
 */

var Util = require('Util');

Creep.prototype.Tail = function() {
    
	if(this.memory.role.toUpperCase() != 'tail'.toUpperCase()) return false;
	//this.say('T')
	
	var near_target = this.room.lookForAtArea('creep', this.pos.y-1, this.pos.x-1, this.pos.y+1, this.pos.x+1);
    var count = 0;
    for(var j in near_target) {
        for(var k in near_target[j]) {
            if(near_target[j][k] != undefined && near_target[j][k][0].memory.role == 'Work') {
                near_target[j][k][0].transferEnergy(this);
            }
        }
    }
                    
	if(this.target === null) {
	    
		Util.setUp(this, 'role.valid_targets');
		for(var i in this.role.valid_targets) {
		    
		    i = this.role.valid_targets[i];
		    //this.log(i.search);
		    var num = i.search;
		    var filter = i.filter;
		    //console.log(this.role.valid_targets[i] +': '+filter)
		    var num = i.search;
		    if(isNaN(num)) num = Memory.constants[i.search];
		    //this.log(i.search);
		    var type = i.filter;
		    //var type = undefined;
		    if(isNaN(filter)) type = Memory.constants[i.filter];
		    var possible_target = [];
		    if( type === null) type = undefined;
		    if(type != undefined) type = { filter: function(object){return object.structureType == type;} };
		    //this.log(i.search + ': ' + num);
			if(i.filter != undefined) possible_targets = this.pos.room.find(num, { filter: {structureType: Memory.constants[i.filter]} });
			else possible_targets = this.pos.room.find(num);
			
			//this.log(i.search + ': ' + possible_targets +' '+i.filter);
			if(possible_targets.length) {
				var target = possible_targets[Math.floor(Math.random()*possible_targets.length)];
				//this.log(possible_targets);
				
				//if(i.limit != undefined && i.limit != null && target[i.limit.property] > i.limit.num) continue;
				/*if(i.limit != undefined && i.limit != null) {
				    console.log(i.limit.toString())
				    i.limit = i.limit.toString().split('[hits]').join('.hits')
				    console.log(eval(i.limit))
				}*/
				this.target = target;
				this.memory.args = i.limit;
				
				this.memory.findNewTarget = {fun: function(creep) {var target = creep.target; return !eval(creep.memory.args);}};
				//this.log(target +': ' + this.memory.findNewTarget.fun(this) + ' ' + this.memory.args)
				if(i.limit != undefined && i.limit != null && this.memory.findNewTarget.fun(this)) continue;
				//this.log(this.canClaim(new_target, 2))
				this.memory.action = i.action;
				this.target = target;
				this.log('Target set to: ' + target);
                break;
                //this.claim(new_target, 2)
				/*if(this.setTarget(new_target, new_target.pos.getFreeSpace())) {
				    this.log('Target set to: ' + new_target);
				    break;
				}*/

			}
		}
	}
	//this.log(this.memory.findNewTarget.args)
	if(this.memory.findNewTarget === undefined) this.memory.findNewTarget = {fun: function(target){return true;}};
	else if(this.memory.args != undefined) this.memory.findNewTarget = {fun: function(creep) {var target = creep.target; return !eval(creep.memory.args);}};
	else this.memory.findNewTarget = {fun: function(target){return true;}};
	//this.log(this.memory.findNewTarget.fun)
	//this.unclaimAll();
	//this.target = null;
	//this.log(this.target)
	if(this.target === null) return;
	this.moveTo(this.target);
	var err = this[this.memory.action](this.target);
	//this.feedForward();
	//this.log(this.memory.action +': ' + err)
	if(this.memory.time === undefined) this.memory.time = 0;
	var target = this.target;
	//this.log(this.target + ' ' + this.memory.findNewTarget.fun(this) + ' ' + (this.target.hits!=undefined?this.target.hits:'?') + ' ' + this.memory.args)
	if(Game.time - this.memory.time >= Math.random()*100 + 900 || err == ERR_FULL || err == ERR_INVALID_TARGET || this.memory.findNewTarget.fun(this)) {
	    //this.log(this.memory.findNewTarget.fun + ' ' + this.memory.findNewTarget.fun(this));
	    this.memory.time = Game.time;
		this.target = null;
	}
	//this.log(this.target)
	return true;
}

