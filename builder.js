var tool_harvester = require('tool.harvester');
var tool_delivery = require('tool.delivery');
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
    run: function(creep, managerCreepsBuilder) {
        behaviour[creep.memory.behaviour](creep, managerCreepsBuilder);
	}
};

function harvest(creep, managerCreepsBuilder){
	if(!tool_harvester.get_sources(creep, 1000)){
		creep.memory.behaviour = _BUILDER;
		creep.say('BUILDER');
	}		
}

function builder(creep, managerCreepsBuilder){
	//var b = managerCreepsBuilder.run(creep);
	var b = tool_builder.builder(creep);
	if (!b){			
		if(creep.carry.energy > 0){
			//console.log(creep.name + ' builder to upgrader');
			if(!tool_delivery.upgrade_center(creep)){
				creep.memory.behaviour = _HARVEST;
				creep.say('HARVEST');
			}
		}
		else{
			creep.memory.behaviour = _HARVEST;
			creep.say('HARVEST');
		}
	}	
}

module.exports = main;