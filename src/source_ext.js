/**
 * 
 */

RoomPosition.prototype.__defineGetter__('memory', function() {
	return this.pos.memory;
});

RoomPosition.prototype.toString = function() {
   return this.roomName + ': ' + _.padLeft(this.x,2,'0') + ',' + _.padLeft(this.y,2,'0');
}