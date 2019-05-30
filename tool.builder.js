var helper = require('helper');
var tool = require('tool.creep');

const preference = [
		STRUCTURE_TOWER, 
		STRUCTURE_EXTENSION, 
		STRUCTURE_WALL, 
		STRUCTURE_ROAD,
];

var main = {

    /** @param {Creep} creep **/
    builder: function(creep) {
		if(creep.carry.energy > 0){
			//console.log(creep.name + ' start')
			tool.check_above_flag(creep);
			
			var target;
			
			for (var i = 0; i < preference.length; i++)
			{				
				target = find_structure_to_repair(creep, get_preference(i));
				//console.log(creep.name + ' ' + i + ': ' + target);
				if(target != null){				
					if(creep.repair(target) == ERR_NOT_IN_RANGE) {
						tool.moveTo(creep, target);
					}					
					//console.log(creep.name + ' ok');
					return true;
				}	
			}
			
			for (var i = 0; i < preference.length; i++)
			{
				target = find_structure_to_construct(creep, get_preference(i));
				//console.log(creep.name + ' ' + i + ': ' + target);
				if(target != null){				
					if(creep.build(target) == ERR_NOT_IN_RANGE) {
						tool.moveTo(creep, target);
					}	
					//console.log(creep.name + ' ok');
					return true;
				}	
			}
		}	
		//console.log(creep.name + ' fon')		
		return false;
	}
};

function find_structure_to_repair(obj, type) {
	//structure.structureType == type & 
    var s = obj.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure) => {
            return ((structure.hits < structure.hitsMax));
        }
    });
	
    return s;
}

function find_structure_to_construct(obj, type) {
    return obj.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);//, {
        //filter: (structure) => {
            //return (structure.structureType == type);
        //}
    //});
}

function get_preference(i){
	return preference[i % preference.length];
}

module.exports = main;