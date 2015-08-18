/**
 * 
 */

toIds = function(targets) {
	if(!Array.isArray(targets)) {
		var keys = Object.keys(targets);
		if(isValid(keys[0]) || isValidId(keys[0])) {
			targets = keys;
		}
		else targets = [targets];
	}
	var proper_targets = []
	for(var i in targets) {
		var cur = targets[i];
		if(isValid(cur)) {
			proper_targets.push(cur.id);
		}
		else if(isValidId(cur)) {
			proper_targets.push(cur);
		}
	}
	return proper_targets;
}
module.exports.toIds = toIds;

isValidId = function(id) {
	if(Game.getObjectById(id)) return true; 
	return false;
}
module.exports.isValidId = isValidId;

isValid = function(object) {
	if(typeof object.id === 'string' && isValidId(object.id)) return true; 
	return false;
}
module.exports.isValid = isValid;

setUp = function(start, memory_path) {
	if(start === undefined) return false;
	if(start.memory_path != undefined) return true;
	var split = memory_path.split('.');
	if(split.length) {
		var path = '';
    	for(var i = 0; i < split.length; i++) {
    		if(start[split[i]] === undefined) start[split[i]] = {};
    		
    		if(typeof start[split[i]] != 'object') return false;
    		start = start[split[i]];
    	}
	}
	else {
		return false;
	}
	return true;
}
module.exports.setUp = setUp;

getDirection = function(i, j) {
	if(j) {
		//(Math.atan2(i, j)/Math.PI) % 8;
		if(j < 0 && i === 0) return TOP                 	//1
		else if(j < 0 && i > 0) return TOP_RIGHT     	//2
		else if(j === 0 && i > 0) return RIGHT         	//3
		else if(j > 0 && i > 0) return BOTTOM_RIGHT 	//4
		else if(j > 0 && i === 0) return BOTTOM        	//5
		else if(j > 0 && i < 0) return BOTTOM_LEFT   	//6
		else if(j === 0 && i < 0) return LEFT           	//7
		else if(j < 0 && i < 0) return TOP_LEFT
		return 0;
	}
	var dir = i;
	var res = {};
	res.x = Math.sign(Math.cos((dir*45-90-45)/180*Math.PI))
	res.y = Math.sign(Math.sin((dir*45-90-45)/180*Math.PI))
	return res;
}
module.exports.getDirection = getDirection;

syncCreeps = function() {
	for(var i in Memory.creeps) {
	    if(!Game.creeps[i]) {
	        delete Memory.creeps[i];
	    }
	}
	for(var i in Game.creeps) {
	    if(!Memory.creeps[i]) {
	        Memory.creeps[i] = Game.creeps[i];
	    }
	}
}
module.exports.syncCreeps = syncCreeps;
