var helper = require('helper');
var tool = require('tool.creep');

var main = {

    /** @param {Creep} creep **/
    get_sources: function(creep) {
		if(creep.carry.energy < creep.carryCapacity) {
			var sources = helper.get_sources(creep);
			if(sources){
				if(creep.harvest(sources) == ERR_NOT_IN_RANGE) {
					tool.moveTo(creep, sources);
				}
			}
			else{
				creep.say('null🔄');
			}
			return true;
		}
		else{
			return false;
		}
	}	
};

module.exports = main;