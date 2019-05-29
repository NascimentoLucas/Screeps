var helper = require('helper');

var roleHarvester = {

    /** @param {Creep} creep **/
    moveTo: function(creep, target) {
		clean_floor(creep);
		creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
	},
	clean_floor: function(creep){
		clean_floor(creep);
	}
};

function clean_floor(creep){
	const found = creep.pos.lookFor(LOOK_ENERGY);
		
	if(found.length > 0){
		var r = creep.pickup(found[0]);
		if(r == OK){
			console.log(creep.name + ' clean');
		}
		else{
			//console.log(creep.name + ' ' + r);
		}
	}
	
	const found2 = creep.pos.lookFor(LOOK_TOMBSTONES);
	
	if(found2.length > 0){
		var r = creep.pickup(found2[0]);
		if(r == OK){
			console.log(creep.name + ' clean');
		}
		else{
			//console.log(creep.name + ' ' + r);
		}
	}
}

module.exports = roleHarvester;