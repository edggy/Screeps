/**
 * 
 */

toIds = function(list) {
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
		else if(isValidId(id)) {
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
	if(typeof object.id === 'function' && isValidId(object.id)) return true; 
	return false;
}
module.exports.isValid = isValid;

setUp = function(start, memory_path) {
	if(start.memory_path) return
	var split = memory_path.split('.');
	var path = '';
	for(var i = 0; i < split.length; i++) {
		path += '"["' + split[i] + '"]"';
		
		var obj = start[eval(path)];
		if(obj === undefined) obj = {};
		if(typeof obj === 'object') continue;
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
module.exports.isValid = getDirection;


