var helper = require('helper');
var tool = require('tool.creep');

var indexPreferenceWork = 0;

function get_builder_command(f, target){
	var s = { 
		command: function (creep){
			return f(creep, target);
		}
	};
	
	return s;
	
}

const preferenceWork = [
	get_builder_command(find_structure_to_construct, STRUCTURE_EXTENSION),
	get_builder_command(find_structure_to_construct, STRUCTURE_TOWER),
	
	get_builder_command(find_structure_to_repair, STRUCTURE_TOWER),
	get_builder_command(find_structure_to_repair, STRUCTURE_WALL),
	get_builder_command(find_structure_to_repair, STRUCTURE_ROAD),
];

var main = {

    /** @param {Creep} creep **/
    builder: function(creep) {
		
		if(creep.carry.energy > 0){
			tool.check_above_flag(creep);			
			
			console.log('-----');
			for (var i = 0; i < preferenceWork.length; i++)
			{	
				if(preferenceWork[i].command(creep)){
					return true;
				}
			}
			
			return repair_or_build(creep);
			
		}	
		
		return false;
	}
};


function find_structure_to_repair(creep, type) {
	if(creep != null){
		var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
			filter: (structure) => {
				return (structure.structureType == type &
						(structure.hits < structure.hitsMax));
			}
		});	
		if(target != null){				
		
			if(creep.repair(target) == ERR_NOT_IN_RANGE) {
				tool.moveTo(creep, target);
			}
			return true;
		}
	}
	return false;
}

function find_structure_to_construct(creep, type) {
	if(creep != null){
		var target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES, {
			filter: (structure) => {
				return (structure.structureType == type);
			}
		});
		
		if(target != null){		
			console.log('building ' + target);
			if(creep.build(target) == ERR_NOT_IN_RANGE) {
				tool.moveMark(creep, target);
			}	
			
			return true;
		}
	}	
	
	return false;
}

function repair_or_build(creep) {	
	
	var target = creep.pos.findClosestByRange(FIND_STRUCTURES);
	
    if(target != null){				
	
		if(creep.build(target) == ERR_NOT_IN_RANGE) {
			tool.moveTo(creep, target);
		}
		return true;
	}
	
	target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.hits < structure.hitsMax);
        }
    });	
	
    if(target != null){				
	
		if(creep.repair(target) == ERR_NOT_IN_RANGE) {
			tool.moveTo(creep, target);
		}
		return true;
	}
	
	return false;
}

function get_preference(i){
	return preference[i % preference.length];
}

module.exports = main;