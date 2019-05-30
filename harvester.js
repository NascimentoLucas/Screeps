var tool_harvester = require('tool.harvester');
var tool_delivery = require('tool.delivery');
var _HARVEST = 0;
var _DELIVERY = 1;

var behaviour =
[
	harvest,
	delivery,
];

var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        behaviour[creep.memory.behaviour](creep);
	}
};

function harvest(creep){
	if(!tool_harvester.get_sources(creep, 1000)){
		creep.memory.behaviour = _DELIVERY;
		creep.say('DELIVERY');
	}		
}

function delivery(creep){
	if (!tool_delivery.delivery_sources(creep)){		
		creep.memory.behaviour = _HARVEST;
		creep.say('HARVEST');
	}	
}

module.exports = roleHarvester;