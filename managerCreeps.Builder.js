var helper = require('helper');
var tool = require('tool.creep');

var max_creep;

var structures_to_repair;

var REPAIR = 0;
var CONSTRUCT = 0;

function setup_builder_command(obj, target){
	var f;
	var get_group;
	
	if(obj == CONSTRUCT){
		f = find_structure_to_construct;
		get_group = get_constructionSites;
	}
	else if(obj == REPAIR){
		f = find_structure_to_repair;
		get_group = get_structures_to_repair;
	}
	
	var s = { 
		command: function (){
			return f(get_group(), target);
		}
	};
	
	return s;
	
}

const preferenceWork = [
	//setup_builder_command(repair_wall, 100),
	//setup_builder_command(repair_rampart, 100),
	
	setup_builder_command(CONSTRUCT, STRUCTURE_WALL),
	
	setup_builder_command(REPAIR, STRUCTURE_TOWER),	
	setup_builder_command(CONSTRUCT, STRUCTURE_TOWER),
	
	setup_builder_command(REPAIR, STRUCTURE_RAMPART),	
	setup_builder_command(CONSTRUCT, STRUCTURE_RAMPART),		
	
	setup_builder_command(REPAIR, STRUCTURE_ROAD),
	
		
	setup_builder_command(REPAIR, STRUCTURE_EXTENSION),	
	setup_builder_command(CONSTRUCT, STRUCTURE_EXTENSION),
	
	setup_builder_command(CONSTRUCT, STRUCTURE_ROAD),	
						
	
	setup_builder_command(REPAIR, STRUCTURE_WALL),
];


var main = {
	bt: [],
	count: 0,
    start: function (mc) {
		max_creep = mc;
		
		//Game.constructionSites;
        structures_to_repair = set_structures_to_repair();
		
		
		for(var i = 0; i < preferenceWork.length; i++){
			preferenceWork[i].command();
		}		
    },
	run: function (creep) {		
		if(creep.carry.energy > 0){
			var builder = main.bt[main.count];
			if(builder){
				var r = builder.run(creep);
				var start = main.count;
				do {
					if(r == ERR_NOT_IN_RANGE) {
						tool.moveMark(creep, builder.target);
						creep.say('gt' + builder.target.id);
						
					}
					else if(r == ERR_INVALID_TARGET) {	
						creep.say('lf');						
					}
					else{			
						creep.say('m' + main.count);
					}
					
					main.count++;
					if( main.count > main.bt.length - 1){
						main.count = 0;
					}
					
					if(start == main.count){
						creep.say('bad');
						return false;
					}
				}
				while(r == ERR_INVALID_TARGET);
				
				
			}
			else{
				return false;
			}
			return true;
		}
		return false;
	},
	reset: function (creep) {
		main.count  = 0;
	}
};

function createBuilder(action, t){
	
	var s = {
		target: t,
		run: function (creep){
			return action(creep, s.target);
		}
	};
	
	return s;
}

function construct(creep, target){	
	var r = creep.build(target);
	
	return r;
}

function repair(creep, target){
	var r = creep.repair(target);
	
	return r;
}

function find_structure_to_construct(group, type){
	
	for(var key in group){
		if(group[key].structureType == type){
			if(main.bt.length < max_creep){
				main.bt.push(createBuilder(construct, group[key]));
			}
			else{
				break;
			}
		}
	}
	
}

function find_structure_to_repair(group, type){
	
	for(var key in group){
		if(group[key].structureType == type){
			if(group[key].hits < group[key].hitsMax){
				if(main.bt.length < max_creep){
					main.bt.push(createBuilder(repair, group[key]));
				}
				else{
					break;
				}
			}
		}
	}
	
}

function set_structures_to_repair() {
		var targets;
		
		for(var flagName in Memory.purpleFlags){
			
			try{
				var flag = Game.flags[Memory.purpleFlags[flagName]];
				
				var targets = flag.pos.findInRange(FIND_STRUCTURES, 1000, {
					filter: (structure) => {
						return structure.hits < structure.hitsMax;
					}
				});
				
				if(targets != null){							
					return targets;
				}
				
			}
			catch(err){				
			
			}
		}
	
	return target;
}

function get_constructionSites(){
	return Game.constructionSites;
}

function get_structures_to_repair(){
	return Game.constructionSites;
}

module.exports = main;