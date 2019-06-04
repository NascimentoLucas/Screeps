var helper = require('helper');
var tool = require('tool.creep');
var tool_builder = require('tool.builder');

var main = {

    /** @param {Creep} creep **/
    delivery_sources: function(creep) {
		if (creep.carry.energy > 0){
			var target = Game.rooms['E15S18'].controller.pos.findClosestByRange(FIND_STRUCTURES, {
					filter: (structure) => {
						return (structure.structureType == STRUCTURE_TOWER) 
						&& structure.energy < structure.energyCapacity;
					}
			});
			//console.log(Game.rooms['E15S18'].controller.pos.findClosestByRange);
			if(!target){
				target = Game.rooms['E15S18'].controller.pos.findClosestByRange(FIND_STRUCTURES, {
						filter: (structure) => {
							return (structure.structureType == STRUCTURE_EXTENSION 
							|| structure.structureType == STRUCTURE_SPAWN) 
							&& structure.energy < structure.energyCapacity;
						}
				});
			}
			
			if(target) {
				if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					tool.moveTo(creep, target);
				}
			}
			else{
				if(!tool_builder.builder(creep)){
					if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
						tool.moveTo(creep, creep.room.controller);
					}
				}
			}
			return true;
		}
		else{
			return false;
		}
	},	
	upgrade_center(creep){
		if (creep.carry.energy > 0){
			if(creep.upgradeController(Game.rooms['E15S18'].controller) == ERR_NOT_IN_RANGE) {
				tool.moveTo(creep, Game.rooms['E15S18'].controller);
			}
			return true;
		}
		
		return false;
	}
};

module.exports = main;