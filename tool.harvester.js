var helper = require('helper');
var tool = require('tool.creep');

var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
	    if(creep.carry.energy < creep.carryCapacity) {
			
        }
        else {
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
        }
	},
    get_sources: function(creep) {
		var sources = helper.get_sources(creep);
		if(creep.harvest(sources) == ERR_NOT_IN_RANGE) {
			tool.moveTo(creep, sources);
		}
	}	
};

module.exports = roleHarvester;