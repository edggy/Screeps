/**
 * 
 */

var ROOT = Memory;

var Filepath = function Filepath(path, working_dir) {
	if(path === '/' && working_dir === undefined) {
		this._filename = '';
		this._dir = '';
	}
	if(typeof path != 'string') this._valid = false;
	else {
		
		if(working_dir === undefined) working_dir = new Filepath('/');
		else if(typeof working_dir == 'string') working_dir = new Filepath('/' + _.trim(working_dir, '/'));
		else if(!(working_dir instanceof Filepath)) this._valid = false;
		else {
			
			if(_.startsWith(path, '..'))  {
				path = working_dir.dir.toString() + '/' + _.trim(this._path.slice(2), '/');
			}
			else if(_.startsWith(path, '.'))  {
				path = working_dir.toString() + '/' + _.trim(this._path.slice(1), '/');
			}
			path = _.trim(path, '/');
			
			var n = path.lastIndexOf('/');
			this._filename = path.substring(n == -1 ? 0 : n + 1);
			this._dir = path.substring(0, n == -1 ? path.length : n);
		}
	}
}

Filepath.prototype.open = function() {
	if(this._data != undefined) return this._data;
	if(this._valid != undefined && !this._valid) return undefined;
		
	var folders = this.dir.path.split('/');
	var cur_dir = ROOT;
	for(i in folders) {
		if(cur_dir[split[i]] === undefined) {
			this._valid = false;
			return undefined;
		}
		cur_dir = cur_dir[split[i]];
	}
	this._data = cur_dir;
	this._valid = true;
	return cur_dir;
}

Filepath.prototype.save = function(data, arguments) {
	if(!this.isValid) return undefined;
}

Filepath.prototype.toString = function() {
	return this.path;
}

Filepath.prototype.parent = function() {
	return new Filepath(this.dir);
}

Filepath.prototype.mkdir = function(arguments) {
	arguments = _.words(arguments);
	if(_.indexOf(arguments, '-p') < 0 && !this.isValid) return false;
	if(this.isValid) return true;
	var par = this.parent;
	if(!par.mkdir(arguments)) return false;
	par[this._filename] = {};
	this._valid = undefined;
	return this.isValid;
}

Filepath.prototype.ls = function(arguments) {
	if(this.isValid) return undefined;
	arguments = _.words(arguments);
	var result = '';
	result += this._data.toString();
	for(i in this._data) {
		result += '\n\t' + i;
		if(_.indexOf(arguments, '-R') >= 0) {
			var child = new Filepath(this.path + '/' + i);
			if(child.isValid) {
				var rec = '\n' + child.ls(arguments);
				result += rec.split('\n').join('\n\t');
			}
		}
	}
	return result;
}
/*Object.defineProperty(Filepath.prototype, "open", {
	enumerable: true,
    get: function() {
    },
	set: function(value) {
	}
});*/

Object.defineProperty(Filepath.prototype, "isValid", {
	enumerable: true,
	get: function() {
		if(this._valid != undefined) return this._valid;
		this.open();
		return this._valid;
    }
});

Object.defineProperty(Filepath.prototype, "path", {
	enumerable: true,
	get: function() {
		return this._dir + '/' + this._filename
    }
});

Object.defineProperty(Filepath.prototype, "name", {
	enumerable: true,
	get: function() {
		return this._filename
    }
});

Object.defineProperty(Filepath.prototype, "dir", {
	enumerable: true,
	get: function() {
		return this._dir;
    }
});

Object.defineProperty(Filepath.prototype, "parent", {
	enumerable: true,
	get: function() {
		return Filepath(this._dir)
    }
});
