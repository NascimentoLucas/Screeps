var helper = {
    ///** @param {Creep} creep **/
    get_energy: function() {
		var energy = 0;
		
		forEach(Game.spawns, function (key){ 
			energy += Game.spawns[key].energy;
		})
		
		forEach(Game.structures, function (key){
			if (Game.structures[key].structureType == STRUCTURE_EXTENSION){
				energy += Game.structures[key].energy;
			}
		})
		
		return energy;
	},
	get_sources(creep){
		var sources = creep.room.find(FIND_SOURCES);
		return sources[0];
	}
};

function forEach(h,f){
	Object.keys(h).forEach(function (key) { 
			f(key);
		})
}

module.exports = helper;