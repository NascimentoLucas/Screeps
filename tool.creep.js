var helper = require('helper');

var roleHarvester = {

    /** @param {Creep} creep **/
    moveTo: function(creep, target) {
		creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
	},
	check_above_flag(creep){
		const look = creep.pos.look();
		look.forEach(function(lookObject) {
			if(lookObject.type == LOOK_FLAGS) {
				console.log(creep.name + ' moving to mainSpawn');
				
				
				for(var name in Game.spawns) {				
					creep.moveTo(creep, Game.spawns[name]);
					
					break;
				}
			}
		});
	}
};
module.exports = roleHarvester;