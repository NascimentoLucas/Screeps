var roleHarvester = require('harvester');
var roleUpgrader = require('upgrader');
var roleBuilder = require('builder');
var helper = require('helper');
var managerCreepsSpwan = require('managerCreeps.spwan');

var max_creep_harvester = 10;
var max_creep_upgrader = 2;
var max_creep_builder = 2;
var max_creep = max_creep_harvester + max_creep_upgrader + max_creep_builder;
var creeps_length;
module.exports.loop = function () {	
	creeps_length = Object.keys(Game.creeps).length;
	
	spawn_controll(creeps_length);
	
	behaviour_controll(creeps_length);
	
	clean();	
}

function clean(){
	
	for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
	
	for(var flagName in Game.flags){
		var flag = Game.flags[flagName];
		
		if(!Game.creeps[flag.memory.owner]){
			flag.memory.owner = '';
		}
	}
	
	for(var name in Game.spawns) {
		var droppped = Game.spawns[name].pos.findClosestByRange(FIND_DROPPED_RESOURCES);
		if(droppped){
			var creep = droppped.pos.findClosestByRange(FIND_MY_CREEPS, {
				filter: function(object) {
					return object.carry.energy < object.carryCapacity;
				}
			});
			
			if(creep){
				creep.say('garbage');
				var r = creep.pickup(droppped);
				if(r == OK){
					console.log(creep.name + ' clean floor at: ' + droppped.pos.x + '/' 
					+ droppped.pos.y);
				}
				else if(r == ERR_NOT_IN_RANGE){
					creep.moveTo(droppped);
				}
				else{
				}
			}
		}
	break;
	}
	
}

function spawn_controll(creeps_length){
	managerCreepsSpwan.run(creeps_length, max_creep, false);
}

function behaviour_controll(creeps_length){
	
	var count = 0;
	
	
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
		if(count < max_creep_harvester) {			
			roleHarvester.run(creep);
			//creep.say('h');
		}
		else if(count < max_creep_upgrader + max_creep_harvester) {
			roleUpgrader.run(creep);
			//creep.say('u');
		}
		else if(count < max_creep_builder + max_creep_upgrader + max_creep_harvester) {
			roleBuilder.run(creep);
			//creep.say('b');
		}
		count++;
    }
	
}