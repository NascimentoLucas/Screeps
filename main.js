var roleHarvester = require('harvester');
var roleUpgrader = require('upgrader');
var roleBuilder = require('builder');
var helper = require('helper');
var managerCreepsSpwan = require('managerCreeps.spwan');
var managerCreepsBuilder = require('managerCreeps.Builder');

var all_creeps;

var max_creep = Memory.max + 1;
var ammount_creep_harvester = 3;
var ammount_creep_upgrader = 2;
var ammount_creep_builder = 5;
var creeps_length;

module.exports.loop = function () {	
	creeps_length = Object.keys(Game.creeps).length;
	
	//remove_construction_sites(STRUCTURE_ROAD);
	
	for (var r in Game.rooms) {
    	defendRoom(r);
	}
	
	tower();
	spawn_controll(creeps_length);
	
	behaviour_controll(creeps_length);
	
	clean();	
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
	
	count = 0;
	managerCreepsBuilder.start(creeps_length);
	
	for(var i = 0; i < all_creeps.length; i++){	
        var creep = Game.creeps[all_creeps[i]];
		
		
		//creep.memory.count = i;
		if(count < ammount_creep_harvester) {
			roleHarvester.run(creep);
			//creep.say('h');			
		}
		else if(count < ammount_creep_harvester + ammount_creep_builder ) {
			creep.say('b');	
			roleBuilder.run(creep, managerCreepsBuilder);
		}
		else {
			
			roleUpgrader.run(creep);	
			//creep.say('u');
			if(!(i < ammount_creep_harvester 
					+ ammount_creep_builder
					+ ammount_creep_upgrader)) {				
				count = -1;	
				//creep.say('u');
			}
		}
		//console.log(creep.ticksToLive);
		//creep.say(i);
		count++;
    }
	managerCreepsBuilder.reset();
	
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
			if(flag.color != COLOR_PURPLE){
				flag.memory.owner = '';
			}
			else{
				garbage(flag);
			}
			//console.log('cleanig flag\'s owner dead');
		}
		else{
			if(Game.creeps[flag.memory.owner].memory.flag != flag.name){
				flag.memory.owner = '';				
				//console.log('cleanig flag\'s owner change');
			}
		}
	}
	
}

function garbage(obj){
	try {
		var droppped = obj.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
		if(droppped){
			var creep = droppped.pos.findClosestByRange(FIND_MY_CREEPS, {
				filter: function(object) {
					return object.carry.energy < object.carryCapacity;
				}
			});
			
			if(creep){
				//creep.say('garbage');
				var r = creep.pickup(droppped);
				if(r == OK){
					//console.log(creep.name + ' clean floor at: ' + droppped.pos.x + '/' 
					//+ droppped.pos.y + ' in ' + obj.name);
				}
				else if(r == ERR_NOT_IN_RANGE){
					creep.moveTo(droppped);
				}
				else{
				}
			}
		}
	}
	catch(err) {
	  
	}
}

function spawn_controll(creeps_length){
	managerCreepsSpwan.run(creeps_length, max_creep);
}

function defendRoom(roomName) {
    var hostiles = Game.rooms[roomName].find(FIND_HOSTILE_CREEPS);
    if(hostiles.length > 0) {
        var username = hostiles[0].owner.username;
        Game.notify(`User ${username} spotted in room ${roomName}`);
        var towers = Game.rooms[roomName].find(
            FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
        towers.forEach(tower => tower.attack(hostiles[0]));
    }
}

function remove_construction_sites(type){
	for (var s in Game.constructionSites) {
    	if(Game.constructionSites[s].structureType == type){
    	    Game.constructionSites[s].remove();
    	}
	}
}