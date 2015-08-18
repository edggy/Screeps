//spawn_ext
/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('spawn_ext'); // -> 'a thing'
 */
 
Spawn.prototype.createWorkerCreep = function(body, name, memory) {
	if(memory === undefined) memory = {};
	if(memory.spawn == undefined) memory.spawn = this.id;
    var err = this.canCreateCreep(body, name);
    if(!err) return this.createCreep(body, name, memory);
    else return err;
};

Spawn.prototype.createLongestCreep = function(body, name, memory) {
	if(memory === undefined) memory = {};
	if(memory.spawn == undefined) memory.spawn = this.id;
	var new_name = name + ' x' + body.length + ' #' + Math.floor(Math.random()*1000);
	var err = this.canCreateCreep(body, new_name);
    while(err < 0 && body.length > 3) {
    	body.pop();
    	new_name = name + ' x' + body.length + ' #' + Math.floor(Math.random()*1000);
    	err = this.canCreateCreep(body, new_name);
    }
    if(err == 0) {
    	err = this.createCreep(body, new_name, memory);
    	//if(err == name + ' x' + body.length) return 0;
    }
    return err;
};

Spawn.prototype.isFull = function() {
    return this.energy >= this.energyCapacity;
}