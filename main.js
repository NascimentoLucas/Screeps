var roleHarvester = require('harvester');
var roleUpgrader = require('upgrader');
var roleBuilder = require('builder');
var helper = require('helper');
var managerCreepsSpwan = require('managerCreeps.spwan');

var all_creeps;

var max_creep_harvester = 10;
var max_creep_upgrader = 4;
var max_creep_builder = 4;
var max_creep = max_creep_harvester + max_creep_upgrader + max_creep_builder;
var creeps_length;

module.exports.loop = function () {	
	creeps_length = Object.keys(Game.creeps).length;
	
	tower();
	
	spawn_controll(creeps_length);
	
	behaviour_controll(creeps_length);
	
	clean();	
}

function tower(){
	var tower;
	for (var t in Game.structures) {
		tower = Game.structures[t];
		if(tower.structureType == StructureTower) {
			var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
				filter: (structure) => structure.hits < structure.hitsMax
			});
			if(closestDamagedStructure) {
				tower.repair(closestDamagedStructure);
			}

			var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
			if(closestHostile) {
				tower.attack(closestHostile);
			}
		}
	}
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
			//console.log('cleanig flag\'s owner dead');
		}
		else{
			if(Game.creeps[flag.memory.owner].memory.flag != flag.name){
				flag.memory.owner = '';				
				//console.log('cleanig flag\'s owner change');
			}
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
					//console.log(creep.name + ' clean floor at: ' + droppped.pos.x + '/' 
					//+ droppped.pos.y);
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
	
	all_creeps = [];
	
	for(var name in Game.creeps) {
		all_creeps.push(name);
	}
	
	var lowest;
	var actual;
	for(var i = 0; i < all_creeps.length; i++){		
		lowest = Game.creeps[all_creeps[i]].ticksToLive;
		for(var j = i; j < all_creeps.length; j++){
			actual = Game.creeps[all_creeps[j]].ticksToLive;
			
			if(actual < lowest){
				Game.creeps[all_creeps[i]].ticksToLive = actual;
				Game.creeps[all_creeps[j]].ticksToLive = lowest;
			}
			
			lowest = Game.creeps[all_creeps[i]].ticksToLive;
		}
	}
	
	for(var i = 0; i < all_creeps.length; i++){	
        var creep = Game.creeps[all_creeps[i]];
		
		
		//creep.memory.count = i;
		if(i < max_creep_harvester) {
			creep.say('h');			
			roleHarvester.run(creep);
		}
		else if(i < max_creep_upgrader + max_creep_harvester) {
			creep.say('u');
			roleUpgrader.run(creep);			
		}
		else{ //if(i < max_creep_builder + max_creep_upgrader + max_creep_harvester) {
			creep.say('b');
			roleBuilder.run(creep);
		}
		//console.log(creep.ticksToLive);
		//creep.say(i);
    }
	
}