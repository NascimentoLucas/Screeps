var tool_harvester = require('tool.harvester');
var tool_delivery = require('tool.delivery');
var _HARVEST = 0;
var _UPGRADE = 1;

var behaviour =
[
	harvest,
	upgrade,
];


var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
        behaviour[creep.memory.behaviour](creep);
	}
};

function harvest(creep){
	if(!tool_harvester.get_sources(creep)){
		creep.memory.behaviour = _UPGRADE;
		creep.say('UPGRADE');
	}		
}

function upgrade(creep){
	if (!tool_delivery.upgrade_center(creep)){		
		creep.memory.behaviour = _HARVEST;
		creep.say('HARVEST');
	}	
}

module.exports = roleUpgrader;