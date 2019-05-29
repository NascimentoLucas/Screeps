var tool_harvester = require('tool.harvester');
var tool_builder = require('tool.builder');
var _HARVEST = 0;
var _BUILDER = 1;

var behaviour =
[
	harvest,
	builder,
];


var main = {

    /** @param {Creep} creep **/
    run: function(creep) {
        behaviour[creep.memory.behaviour](creep);
	}
};

function harvest(creep){
	if(!tool_harvester.get_sources(creep)){
		creep.memory.behaviour = _BUILDER;
		creep.say('BUILDER');
	}		
}

function builder(creep){
	if (!tool_builder.builder(creep)){		
		creep.memory.behaviour = _HARVEST;
		creep.say('HARVEST');
	}	
}

module.exports = main;