/**
 * 
 */

var Util = require('Util');

Creep.prototype.Tail = function() {
	if(this.memory.role.toUpperCase() != 'tail'.toUpperCase()) return false;
	if(this.target === null) {
		Util.setUp(this, 'role.valid_targets');
		var valid_targts = Object.keys(this.role.valid_targets);
		var new_target = null;
		for(i in valid_targts) {
			var possible_targets = this.spawn.room.find(valid_targts[i], valid_targts[i].filter);
			if(possible_targets.length) {
				new_target = possible_targets[Math.floor(Math.random()*possible_targets.length)];
				if(this.setTarget(new_target, new_target.pos.getFreeSpace())) break;
			}
		}
	}
	if(this.target === null) return;
	this.moveTo(target);
	this[this.role.valid_targets.action](target);
	this.feedForward();
	return true;
}

