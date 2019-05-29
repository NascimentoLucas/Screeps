var helper = require('helper');
var tool = require('tool.creep');

var main = {

    /** @param {Creep} creep **/
    builder: function(creep) {
		var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
		if(creep.carry.energy > 0){
			if(targets.length > 0) {
				if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
					creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
				}
				return true;
			}
		}
		return false;
	}
};

module.exports = main;