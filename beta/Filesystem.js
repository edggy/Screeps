/**
 * 
 */

require('Filepath');

var Filesystem = function Filesystem() {
	if(Memory.filesystem === undefined) Memory.filesystem = {_working_dir: '/'};
	else this._working_dir = Memory.filesystem._working_dir;
}

Filesystem.prototype.cd = function(filepath) {
	filepath = this._parse(filepath);
	if(filepath === undefined) return false;
	this._working_dir = filepath.path;
}

Filesystem.prototype.pwd = function(filepath) {
	return this._working_dir;
}

Filesystem.prototype.save = function(filepath, object, arguments) {
	filepath = this._parse(filepath)
	if(filepath === undefined) return false;
	return filepath.save(object, arguments);
}

Filesystem.prototype.mkdir = function(filepath, arguments) {
	filepath = this._parse(filepath)
	if(filepath === undefined) return false;
	return filepath.mkdir(arguments);
}

Filesystem.prototype.ls = function(filepath, arguments) {
	filepath = this._parse(filepath)
	if(filepath === undefined) return false;
	return filepath.ls(arguments);
}


Filesystem.prototype._parse = function(filepath) {
	if(typeof filepath === 'string') {
		return new Filepath(filepath, this._working_dir);
	}
	if(filepath instanceof Filepath) return filepath;
	return undefined;
}