//room_ext
/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('room_ext'); // -> 'a thing'
 */


require('roomPosition_ext');
Room.prototype.tick = function() {
    if(this.memory.map === undefined) this.memory.map = {};
    if(this.memory.mapping_data === undefined) this.memory.mapping_data = {};
    if(this.memory.mapping_data.next === undefined) this.memory.mapping_data.next = new RoomPosition(0, 0, this.name);
    
    this.logController();
    
    this.memory.mapping_data.next = new RoomPosition(this.memory.mapping_data.next.x, this.memory.mapping_data.next.y, this.name);
    var start = Game.getUsedCpu();
    var count = 0
    var end = Game.getUsedCpu();
    while(Game.getUsedCpu() < Game.cpuLimit - (end - start)) {
        //console.log(this.memory.mapping_data.next);
    	if(this.memory.mapping_data.next.memory.usage === undefined) this.memory.mapping_data.next.memory.usage = 0;
        this.memory.mapping_data.next.memory.usage++;
        if(this.memory.mapping_data.next.memory.usage > 200) delete this.memory.mapping_data.next.memory;
        else this.memory.mapping_data.next.update();
        this.memory.mapping_data.next = this.memory.mapping_data.next.nextInRoom();
        count++;
    }
    end = Game.getUsedCpu();
    //console.log('CPU: ' + (end - start) + '\nTiles: ' + count + "\n% of room: " + (count/(50*50)*100) + "\n% of room per CPU: " + (count/(50*50)*100)/(end - start));
}

Room.prototype.loc = function() {
    var N_loc = this.name.indexOf('N');
    var S_loc = this.name.indexOf('S');
    var W_loc = this.name.indexOf('W');
    var E_loc = this.name.indexOf('E');
    
    var res = {};
    
    if(N_loc > -1) {
        res.y = parseInt(this.name.substr(N_loc + 1));
        if(W_loc > -1) res.x = parseInt(this.name.substr(W_loc + 1, N_loc - 1));
        else res.x = -parseInt(this.name.substr(E_loc + 1, N_loc - 1));
    }
    else {
        res.y = -parseInt(this.name.substr(S_loc + 1));
        if(W_loc > -1) res.x = parseInt(this.name.substr(W_loc + 1, S_loc - 1));
        else res.x = -parseInt(this.name.substr(E_loc + 1, S_loc - 1));
    }
    return res;
};

Room.prototype.move = function(left, up) {
    var new_loc = this.loc();
    new_loc.x += left;
    new_loc.y += up;
    var ret = '';
    if(new_loc.x > 0) ret += 'W' + new_loc.x;
    else ret += 'E' + (-new_loc.x);
    if(new_loc.y > 0) ret += 'N' + new_loc.y;
    else ret += 'S' + (-new_loc.y);
    return ret;
}

Room.prototype.logController = function() {
	var log_length = 50;
	var avg_length = 40;
	if(this.memory.data == undefined) this.memory.data = {};
	if(this.memory.data.controller == undefined) this.memory.data.controller = {};
	if(this.memory.data.controller.progress == undefined) this.memory.data.controller.progress = [];
	var time = Game.time % log_length
	this.memory.data.controller.progress[time] = this.controller.progress;
	
	var cur_time = (time - avg_length + cur_time) % log_length;
	/*var sum = 0;
	
	while(cur_time % log_length <= time) {
		sum += this.memory.data.controller.progress[cur_time % log_length];
		cur_time++;
	}*/
	this.memory.data.controller.average = (time - cur_time) / avg_length;
	//console.log(this.memory.data.controller.average);
}

