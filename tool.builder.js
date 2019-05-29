var helper = require('helper');
var tool = require('tool.creep');

var main = {

    /** @param {Creep} creep **/
    builder: function(creep) {
		if(creep.carry.energy > 0){
			var targets = sFinderStructureRepair(creep, null)
			if(targets == null){
				if(creep.repair(targets) == ERR_NOT_IN_RANGE) {
					creep.moveTo(targets, {visualizePathStyle: {stroke: '#ffffff'}});
				}
				return true;
			}			
			else {
				targets = creep.room.find(FIND_CONSTRUCTION_SITES);
				if(targets.length > 0) {
				if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
					creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
				}
				return true;
			}
			}
				
		}
		return false;
	}
};

function sFinderStructureRepair(creep, type) {
	//structure.structureType == type & 
    var s = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return ((structure.hits < structure.hitsMax));
        }
    });
    if (s.length > 0)
    {
        var min = 10000000;
        var target;
        for (const i in s)
        {
            if (s[i].hits < min)
            {
                min = s[i].hits;
                target = s[i];
            }
        }
        return target;
    }
    else
    {
        return null;
    }
}

module.exports = main;