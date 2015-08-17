//room_ext
/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('room_ext'); // -> 'a thing'
 */


require('RoomPosition');
Room.prototype.tick = function() {
    if(this.memory.map === undefined) this.memory.map = {};
    if(this.memory.mapping_data === undefined) this.memory.mapping_data = {};
    if(this.memory.mapping_data.next === undefined) this.memory.mapping_data.next = new RoomPosition(0, 0, this.name);
    
    this.logController();
    
    this.memory.mapping_data.next = new RoomPosition(this.memory.mapping_data.next.x, this.memory.mapping_data.next.y, this.name);
    var start = Game.getUsedCpu();
    var count = 0
    var end = Game.getUsedCpu();
    //while(Game.getUsedCpu() < Game.cpuLimit - (end - start)) {
    /*for(var i = 0; i < 50; i++){
        //console.log(this.memory.mapping_data.next);
    	if(this.memory.mapping_data.next.memory.usage === undefined) this.memory.mapping_data.next.memory.usage = 0;
        this.memory.mapping_data.next.memory.usage++;
        if(this.memory.mapping_data.next.memory.usage > 200) delete this.memory.mapping_data.next.memory;
        else this.memory.mapping_data.next.update();
        this.memory.mapping_data.next = this.memory.mapping_data.next.nextInRoom();
        count++;
    }*/
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
	var log_length = 200;
	var avg_length = 190;
	if(this.memory.data == undefined) this.memory.data = {};
	if(this.memory.data.controller == undefined) this.memory.data.controller = {};
	if(this.memory.data.controller.progress == undefined) this.memory.data.controller.progress = [];
	if(this.memory.data.controller.best == undefined) this.memory.data.controller.best = {};
	if(this.memory.data.tick == undefined) this.memory.data.tick = {};
	if(this.memory.data.tick.time == undefined) this.memory.data.tick.time = [];
	
	var time_index = Game.time % log_length
	this.memory.data.controller.progress[time_index] = this.controller.progress;
	this.memory.data.tick.time[time_index] = Date.now();
	
	var last_time_index = (time_index - avg_length + log_length) % log_length;
	
	var amount = this.memory.data.controller.progress[time_index]
	var last_amount = this.memory.data.controller.progress[last_time_index]

	this.memory.data.controller.average = (amount - last_amount) / avg_length;
	if(this.memory.data.controller.average > this.memory.data.controller.best) this.memory.data.controller.best = this.memory.data.controller.average;
	
	var time_now = this.memory.data.tick.time[time_index]
	var time_then = this.memory.data.tick.time[last_time_index]
	
	this.memory.data.tick.average = (time_now - time_then) / avg_length;
	///*
	if(Game.time % 10 == 5) console.log('Speed: ' + this.memory.data.controller.average + ' Progress / Tick' );
	//if(Game.time % 10 == 5) console.log('Speed: ' + this.memory.data.controller.average * this.memory.data.tick.average / 1000 + ' Ticks / Second' );
	if(this.memory.data.controller.average) {
	    this.memory.data.controller.time_to_level = this.controller.progressTotal / (this.memory.data.controller.average);
		if(Game.time % 10 == 0) console.log('Time to Level: ' + this.memory.data.controller.time_to_level + ' Ticks' );
		/*var time = Math.floor(this.memory.data.controller.time_to_level * this.memory.data.tick.average)
		var seconds = Math.floor(time / 1000);
		var minutes = Math.floor(seconds / 60);
		var hours = Math.floor(minutes / 60);
		var days = Math.floor(hours / 24);
		var time_string = (hours % 24) + ':' + (minutes % 60) + ':' + (seconds % 60) + '.' + (time % 1000);
		if(days) time_string = + days + ':' + time_string;
		if(Game.time % 10 == 0) console.log('Time to Level: ' + time_string + ' Seconds' );
		*/
	}
	//console.log(this.controller.progress);
	//*/
}

