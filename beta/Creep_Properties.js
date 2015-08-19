/**
 * 
 */

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