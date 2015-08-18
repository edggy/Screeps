/**
 * 
 */

var Util = require('Util');

Creep.prototype.Tail = function() {
	if(this.memory.role.toUpperCase() != 'tail'.toUpperCase()) return false;
	if(this.target === null) {
		Util.setUp(this, 'role.valid_targets');
		for(i in this.role.valid_targets) {
		    var num = i;
		    var filter = this.role.valid_targets[i];
		    if(isNaN(i)) var num = Memory.constants[i];
		    if(isNaN(this.role.valid_targets[i])) var filter = Memory.constants[this.role.valid_targets[i]];
			var possible_targets = this.spawn.room.find(num, filter);
			if(possible_targets.length) {
				var new_target = possible_targets[Math.floor(Math.random()*possible_targets.length)];
				if(this.setTarget(new_target, new_target.pos.getFreeSpace())) {
					this.memory.action = this.role.valid_targets[i].action;
					break;
				}
			}
		}
	}
	if(this.target === null) return;
	this.moveTo(this.target);
	this[this.memory.action](this.target);
	this.feedForward();
	if(Game.time % 100 >= Math.random()*100) {
		this.target === null;
	}
	return true;
}

