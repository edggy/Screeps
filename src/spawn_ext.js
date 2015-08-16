//spawn_ext
/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('spawn_ext'); // -> 'a thing'
 */

//test
 
Spawn.prototype.createWorkerCreep = function(body, name) {
    var err = this.canCreateCreep(body, name);
    if(!err) return this.createCreep(body, name);
    else return err;
};

Spawn.prototype.isFull = function() {
    return this.energy >= this.energyCapacity;
}