/**
 * 
 */

var Util = require('Util');

Creep.prototype.Head = function() {
	if(this.memory.role.toUpperCase() != 'head'.toUpperCase()) return false;
	if(this.target === null) {
		Util.setUp(Memory, 'global.roles.Head.valid_targets');
		Util.setUp(Memory, 'global.roles.Tail.valid_targets');
		var valid_targts = Object.keys(this.role.valid_targets);
		var new_target = null;
		for(i in valid_targts) {
			var possible_targets = this.spawn.room.find(i, i.filter);
			if(possible_targets.length) {
				new_target = possible_targets[Math.floor(Math.random()*possible_targets.length)];
				if(this.setTarget(new_target, new_target.pos.getFreeSpace())) break;
			}
		}
	}
	if(this.target === null) return;
	this.moveTo(target);
	this[this.role.valid_targets.action](target);
	this.feedForward(4, 4);
	return true;
}