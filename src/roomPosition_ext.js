//roomPosition_ext
/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('roomPosition_ext'); // -> 'a thing'
 */

//
RoomPosition.prototype.getMemory = function() {
    var room = Game.rooms[this.roomName];
    if(room == undefined) return undefined;
    if(room.memory.map[this.x+','+this.y] === undefined) room.memory.map[this.x+','+this.y] = {};
    return room.memory.map[this.x+','+this.y];
}

RoomPosition.prototype.__defineGetter__('memory', function() { 
    var room = Game.rooms[this.roomName];
    if(room == undefined) return undefined;
    if(room.memory.map[this.x+','+this.y] === undefined) room.memory.map[this.x+','+this.y] = {};
    return room.memory.map[this.x+','+this.y];
});
//RoomPosition.prototype.memory = Memory.rooms[this.roomName].memory.map[this.x+','+this.y];

RoomPosition.prototype.toString = function() {
   return this.roomName + ': ' + this.x + ',' + this.y;
}

RoomPosition.prototype.walkable = function() {
    var room = Game.rooms[this.roomName];
    var at_loc = room.lookAt(this);
    for(t in at_loc) {
        t = at_loc[t];
        if(t.type === 'terrain' && t.terrain === 'wall') return 0;
        if(t.type === 'structure') {
            if(t.structure.structureType === STRUCTURE_EXTENSION) return 0;
            if(t.structure.structureType === STRUCTURE_WALL) return 0;
            if(t.structure.structureType === STRUCTURE_KEEPER_LAIR) return 0;
            if(t.structure.structureType === STRUCTURE_LINK) return 0;
            if(t.structure.structureType === STRUCTURE_CONTROLLER) return 0;
            if(t.structure.structureType === STRUCTURE_PORTAL) return 0;
            if(t.structure.structureType === 'storage') return 0;
            
            if(t.structure.structureType === STRUCTURE_ROAD) return 2;
        }
    }
    return 1;
}

RoomPosition.prototype.__defineGetter__('pos', function() { return this});

RoomPosition.prototype.mark = function() {
    this.getMemory()[this.toString()] = 0;
    this.memory.usage = 0;
}

RoomPosition.prototype.distTo = function(roomPosition) {
	this.memory.usage = 0;
    roomPosition = roomPosition.pos;
    //console.log(roomPosition);
    if(this.getMemory()[roomPosition.toString()] === undefined) {
        if(roomPosition.getMemory()[this.toString()] === undefined) {
            roomPosition.mark();
            return Number.MAX_SAFE_INTEGER;
        }
        this.getMemory()[roomPosition.toString()] = roomPosition.getMemory()[this.toString()];
        return roomPosition.getMemory()[this.toString()];
    }
    return this.getMemory()[roomPosition.toString()];
}

RoomPosition.prototype.findClosest = function(list) {
    closest = {obj: {}, dist: Number.MAX_SAFE_INTEGER};
    for(i in list) {
        var dist = this.distTo(list[i].pos);
        if(dist < closest.dist) {
            closest.dist = dist;
            closest.obj = list[i];
        }
    }
    return closest.obj;
}

RoomPosition.prototype.dirTo = function(roomPosition) {
	this.memory.usage = 0;
    roomPosition = roomPosition.pos;
    var best = {dist: Number.MAX_SAFE_INTEGER, dir: 0, usage: Number.MAX_SAFE_INTEGER};
    for(var i = -1; i <= 1; i++) {
        for(var j = -1; j <= 1; j++) {
            var cur_room = this.roomName;
            if(this.x + i < 0) cur_room = room.move(1, 0);
            else if(this.x + i > 49) cur_room = room.move(-1, 0);
            
            if(this.y + j < 0) cur_room = room.move(0, 1);
            else if(this.y + j > 49) cur_room = room.move(0, -1);
            
            var cur_pos = new RoomPosition(this.x + i, this.y + j, cur_room);
            //cur_room = Game.rooms[cur_room];
            
            if(cur_pos === undefined || !cur_pos.walkable()) continue;
            var dist = cur_pos.memory[roomPosition.toString()];
            var usage = cur_pos.memory.usage;
            if(dist < best.dist || (dist == best.dist && usage < best.usage) || (dist == best.dist && usage == best.usage && Math.random() < 0.5)) {
                best.dist = dist;
                best.usage = usage;
                if(j === -1 && i === 0) best.dir = TOP                 //1
                else if(j === -1 && i === 1) best.dir = TOP_RIGHT     //2
                else if(j === 0 && i === 1) best.dir = RIGHT         //3
                else if(j === 1 && i === 1) best.dir = BOTTOM_RIGHT //4
                else if(j === 1 && i === 0) best.dir = BOTTOM        //5
                else if(j === 1 && i === -1) best.dir = BOTTOM_LEFT   //6
                else if(j === 0 && i === -1) best.dir = LEFT           //7
                else if(j === -1 && i === -1) best.dir = TOP_LEFT       //8
            }
        }
    }
    return best.dir;
}

RoomPosition.prototype.update = function() {
    //console.log(this + ' is walkable: ' + this.walkable());
    if(!this.walkable()) {
        for(loc in this.getMemory()) {
            delete this.getMemory()[loc];
            //console.log('Updated ' + this + ' ' + this.getMemory());
        }
        return
    }
    var room = Game.rooms[this.roomName];
    if(room == undefined) return false;
    
    var best = {};
    for(var i = this.x - 1; i <= this.x + 1; i++) {
        for(var j = this.y - 1; j <= this.y + 1; j++) {
            var cur_room = this.roomName;
            if(i < 0) cur_room = room.move(1, 0);
            else if(i > 49) cur_room = room.move(-1, 0);
            
            if(j < 0) cur_room = room.move(0, 1);
            else if(j > 49) cur_room = room.move(0, -1);
            
            var cur_pos = new RoomPosition(i, j, cur_room);
            //cur_room = Game.rooms[cur_room];
            
            if(cur_pos === undefined) continue;
            
            for(loc in cur_pos.getMemory()) {
                if(best[loc] === undefined || cur_pos.getMemory()[loc] < best[loc]) {
                    best[loc] = cur_pos.getMemory()[loc];
                }
            }
        }
    }
    for(loc in best) {
        var cost = 2;
        this.getMemory()[loc] = best[loc] + cost;
        //console.log('Updated ' + this + ' ' + loc + ' ' + this.getMemory()[loc]);
    }
}

RoomPosition.prototype.look = function(dir) {
	if(dir == TOP) {
		return new RoomPosition(this.x, this.y - 1, this.roomName);
	}
	else if(dir == TOP_RIGHT) {
		return new RoomPosition(this.x + 1, this.y - 1, this.roomName);
	}
	else if(dir == RIGHT) {
		return new RoomPosition(this.x + 1, this.y, this.roomName);
	}
	else if(dir == BOTTOM_RIGHT) {
		return new RoomPosition(this.x + 1, this.y + 1, this.roomName);
	}
	else if(dir == BOTTOM) {
		return new RoomPosition(this.x, this.y + 1, this.roomName);
	}
	else if(dir == BOTTOM_LEFT) {
		return new RoomPosition(this.x - 1, this.y + 1, this.roomName);
	}
	else if(dir == LEFT) {
		return new RoomPosition(this.x - 1, this.y, this.roomName);
	}
	else if(dir == TOP_LEFT) {
		return new RoomPosition(this.x - 1, this.y - 1, this.roomName);
	}
}

RoomPosition.prototype.nextInRoom = function() {
    var next_x = this.x + 1;
    var next_y = this.y;
    if(next_x >= 50) {
        next_x = 0;
        next_y = (next_y + 1) % 50;
    }
    return new RoomPosition(next_x, next_y, this.roomName);
}