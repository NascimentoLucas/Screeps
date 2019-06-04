var helper = require('helper');

var roleHarvester = {

    /** @param {Creep} creep **/
    moveTo: function(creep, target) {
		creep.moveTo(target);
	},
	moveMark: function(creep, target) {
		creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
	},
	check_above_flag(creep){
		const look = creep.pos.look();
		look.forEach(function(lookObject) {
			if(lookObject.type == LOOK_FLAGS) {
				
				
				for(var name in Game.spawns) {
					creep.moveTo(Game.spawns[name], {visualizePathStyle: {stroke: '#ffaa00'}});
				    //console.log(creep.name + ' moving to mainSpawn ' + Game.spawns[name].pos);
					break;
				}
			}
		});
	},	
	is_above_flag(creep){
		const look = creep.pos.look();
		look.forEach(function(lookObject) {
			if(lookObject.type == LOOK_FLAGS) {
				
				
				for(var name in Game.spawns) {
					return true;
				}
			}
		});
		return false;
	}
};
module.exports = roleHarvester;