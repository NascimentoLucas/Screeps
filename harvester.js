var tool_harvester = require('tool.harvester');
var _HARVEST = 0;
var _DELIVERY = 1;

var behaviour =
[
	harvest,
	delivery,
];

var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
	    if(creep.carry.energy < creep.carryCapacity) {
			behaviour[creep.memory.behaviour](creep);
		}
        else {
            behaviour[creep.memory.behaviour](creep);
        }
	}
};

function harvest(creep){
	if(creep.carry.energy < creep.carryCapacity) {
		tool_harvester.get_sources(creep);
	}
	else{
		creep.memory.behaviour = _DELIVERY;
	}		
}

function delivery(creep){
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
	}
	else{
		creep.memory.behaviour = _HARVEST;
	}	
}

module.exports = roleHarvester;