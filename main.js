var roleHarvester = require('harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var helper = require('helper');

var max_creep_harvester = 3;
var max_creep_upgrader = max_creep_harvester + 3;
var max_creep_builder = max_creep_upgrader + 3;
var max_creep = max_creep_harvester + max_creep_upgrader + max_creep_builder;
max_creep = max_creep_harvester;
var creeps_length;
module.exports.loop = function () {	
	creeps_length = Object.keys(Game.creeps).length;
	
	for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
	
	spawn_controll(creeps_length);
	
	behaviour_controll(creeps_length);
}

function spawn_creep(count ){	
	get_main_spawn().spawnCreep([WORK, CARRY, MOVE], 'creep_' + count, 
	{memory: {behaviour: 0}});
}

function get_main_spawn(){
	return Game.getObjectById(Memory.mainSpawn);
}

function spawn_controll(creeps_length){
	if(get_main_spawn()){
		if (creeps_length < max_creep){
			if(helper.get_energy() >= 300){
				spawn_creep(creeps_length);
			}
		}
	}	
	else{
		Object.keys(Game.spawns).forEach(function (key) { 
			Memory.mainSpawn = Game.spawns[key].id;
		})
	}
}

function behaviour_controll(creeps_length){
	
	var count = 0;
	
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
		if(count < max_creep_harvester) {
			roleHarvester.run(creep);
		}
		if(count < max_creep_upgrader) {
			continue;
			roleUpgrader.run(creep);
		}
		if(count < max_creep_builder) {
			roleBuilder.run(creep);
		}
		count++;
    }
	
}