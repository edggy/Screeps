//roomPosition_ext
/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('roomPosition_ext'); // -> 'a thing'
 */

var Util = require('Util');

Object.defineProperty(RoomPosition.prototype, "room", {
	enumerable: true,
    get: function() {
    	return Game.rooms[this.roomName];
    }
});

Object.defineProperty(RoomPosition.prototype, "memory", {
	enumerable: true,
    get: function() {
    	var name = this.x+','+this.y
    	Util.setUp(Memory.rooms[this.roomName], this.toString());
    	return Memory.rooms[this.roomName][this.toString()];
    }
});

Object.defineProperty(RoomPosition.prototype, "pos", {
	enumerable: true,
    get: function() {
    	return this;
    }
});

RoomPosition.prototype.toString = function() {
   return this.roomName + ': ' + _.padLeft(this.x,2,'0') + ',' + _.padLeft(this.y,2,'0');
}

RoomPosition.prototype.getFreeSpace = function() {
	Util.setUp(Memory, 'global.RoomPosition.RecheckTime');
	if(this.memory.freeSpace || this.memory.freeSpace.lastCheck > Memory.global.RoomPosition.RecheckTime) {
		this.memory.freeSpace = {space: 0};
		for(var i = -1; i <= 1; i++) {
			for(var j = -1; j <= 1; j++) {
				var adj = new RoomPosition(this.x + i, this.y + j, this.roomName);
				if(adj.walkable()) this.memory.freeSpace.space++;
			}
		}
		this.memory.freeSpace.lastCheck = Game.time;
	}
	return this.memory.freeSpace;
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

RoomPosition.prototype.mark = function(value) {
    this.memory[this.toString()] = value;
    this.memory.usage = 0;
}

RoomPosition.prototype.distTo = function(roomPosition) {
	roomPosition.memory.usage = 0;
    roomPosition = roomPosition.pos;
    if(this.memory[roomPosition.toString()] === undefined) {
        if(roomPosition.memory[this.toString()] === undefined) {
            roomPosition.mark();
            return Number.MAX_SAFE_INTEGER;
        }
        //this.memory[roomPosition.toString()] = roomPosition.memory[this.toString()];
        return roomPosition.memory[this.toString()];
    }
    return this.memory[roomPosition.toString()];
}

RoomPosition.prototype.dirTo = function(roomPosition) {
	roomPosition.memory.usage = 0;
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

            if(cur_pos === undefined || !cur_pos.walkable()) continue;
            var dist = cur_pos.memory[roomPosition.toString()];
            var usage = cur_pos.memory.usage;
            if(dist < best.dist || (dist == best.dist && usage < best.usage) || (dist == best.dist && usage == best.usage && Math.random() < 0.5)) {
                best.dist = dist;
                best.usage = usage;
                best.dir = Util.getDirection(i, j);
            }
        }
    }
    return best.dir;
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

RoomPosition.prototype.update = function() {
    //console.log(this + ' is walkable: ' + this.walkable());
    /*if(!this.walkable()) {
        for(loc in this.memory) {
            delete this.memory[loc];
            //console.log('Updated ' + this + ' ' + this.memory);
        }
        return
    }*/
    var room = Game.rooms[this.roomName];
    if(room == undefined) return false;
    
    var best = {};
    for(var i = this.x - 1; i <= this.x + 1; i++) {
        for(var j = this.y - 1; j <= this.y + 1; j++) {
            var cur_room = this.roomName;
            if(i < 0) cur_room = this.room.move(1, 0);
            else if(i > 49) cur_room = this.room.move(-1, 0);
            
            if(j < 0) cur_room = this.room.move(0, 1);
            else if(j > 49) cur_room = this.room.move(0, -1);
            
            var cur_pos = new RoomPosition(i, j, cur_room);
            //cur_room = Game.rooms[cur_room];
            
            if(cur_pos === undefined) continue;
            
            for(loc in cur_pos.memory) {
                if(best[loc] === undefined || cur_pos.memory[loc] < best[loc]) {
                    best[loc] = cur_pos.memory[loc];
                }
            }
        }
    }
    for(loc in best) {
        var cost = 2;
        this.memory[loc] = best[loc] + cost;
        //console.log('Updated ' + this + ' ' + loc + ' ' + this.memory[loc]);
    }
}

RoomPosition.prototype.look = function(dir) {
	var offset = getDirection(dir);
	var x = this.x + offset.x;
	var y = this.y + offset.y;
	var new_room = this.roomName;
	if(y < 0) {
		y += 50;
		new_room = Game.rooms[this.roomName].move(TOP).name;
	}
	else if(y >= 50) {
		y -= 50;
		new_room = Game.rooms[this.roomName].move(BOTTOM).name;
	}
	if(x < 0) {
		x += 50;
		new_room = Game.rooms[this.roomName].move(LEFT).name;
	}
	else if(x >= 50) {
		x -= 50;
		new_room = Game.rooms[this.roomName].move(RIGHT).name;
	}
	return new RoomPosition(x, y, new_room);
	/*if(dir == TOP) {
		if(this.y - 1 >= 0) return new RoomPosition(this.x, this.y - 1, this.roomName);
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
	}*/
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