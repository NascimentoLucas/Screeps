var helper = require('helper');
var tool = require('tool.creep');

var main = {

    /** @param {Creep} creep **/
    delivery_sources: function(creep) {
		if (creep.carry.energy > 0){
			var targets = creep.room.find(FIND_STRUCTURES, {
					filter: (structure) => {
						return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
							structure.energy < structure.energyCapacity;
					}
			});
			if(targets.length > 0) {
				if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
				}
			}
			else{
				if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
					creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
				}
			}
			return true;
		}
		else{
			return false;
		}
	}	
};

module.exports = main;