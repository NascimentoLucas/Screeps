var helper = require('helper');

var roleHarvester = {

    /** @param {Creep} creep **/
    moveTo: function(creep, target) {
		creep.moveTo(target, {visualizePathStyle: {stroke: '#ffaa00'}});
	}
};
module.exports = roleHarvester;