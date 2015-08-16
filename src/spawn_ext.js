//spawn_ext
/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('spawn_ext'); // -> 'a thing'
 */
 
Spawn.prototype.createWorkerCreep = function(body, name) {
    var err = this.canCreateCreep(body, name);
    if(!err) return this.createCreep(body, name);
    else return err;
};

Spawn.prototype.createLongestCreep = function(body, name) {
	
	var err = spawn.canCreateCreep(body);
    while(err < 0 && body.length > 3) {
    	body.pop();
    	err = spawn.canCreateCreep(body);
    }
    if(err == 0) {
    	err = spawn.createCreep(body, name + ' x' + body.length);
    	if(err == name + ' x' + body.length) return 0;
    }
    return err;
};

Spawn.prototype.isFull = function() {
    return this.energy >= this.energyCapacity;
}