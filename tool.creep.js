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
				
				
				for(var name in Game.spawns) {		
			    	creep.move(LEFT);
					creep.moveTo(Game.spawns[name], {visualizePathStyle: {stroke: '#ffaa00'}});
				    console.log(creep.name + ' moving to mainSpawn ' + Game.spawns[name].pos);
					break;
				}
			}
		});
	}
};
module.exports = roleHarvester;