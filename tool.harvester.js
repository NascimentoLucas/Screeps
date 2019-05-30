var helper = require('helper');
var tool = require('tool.creep');

var _FLAGNULL = '_FLAGNULL';

var standard_distance = 5;

var main = {

    /** @param {Creep} creep **/
    get_sources: function(creep, first_flag_distance) {	
		//cleanFlag(creep, Game.flags[creep.memory.flag]);
		//return false;
		if(Game.flags[creep.memory.flag]){
			if(nearFlag(creep)){
				if(creep.carry.energy < creep.carryCapacity) {
					var r = mining(creep);
					
					if(r == OK){	
					}
					else if(r == ERR_NOT_IN_RANGE){					
						if(find_flag(standard_distance, creep, Game.flags[creep.memory.flag].color - 1)){
							//say(creep, creep.memory.count);					
							return true;
						}
						else{
							say(creep, Game.flags[creep.memory.flag].color - 1);	
							if(Game.flags[creep.memory.flag].color <= COLOR_YELLOW){								
								go_to_exit(creep, standard_distance);
							}
							//console.log('did not find NEW flag.color: ' + (Game.flags[creep.memory.flag].color - 1));
						}
					}
				}
				else{					
                    return go_to_exit(creep, standard_distance);					
				}
				
			}
			else{
				say(creep,'gt:' + Game.flags[creep.memory.flag].name);				
				tool.moveTo(creep, Game.flags[creep.memory.flag]);
			}
			return true;
		}
		else{
			say(creep, 'w');
			//console.log(creep.name + ' looking for flag');
			tool.check_above_flag(creep);				
			find_flag(first_flag_distance, creep, COLOR_WHITE);
			return true;
		}	
		return false;
	}
}

function say(creep, msg){
	creep.say(msg);
	//creep.memory.msg = msg;
	
}

function go_to_exit(creep){
	//console.log(creep.name + ' looking for flag');
	if (Game.flags[creep.memory.flag].color > COLOR_YELLOW){
		if(find_flag(standard_distance, creep, Game.flags[creep.memory.flag].color - 1)){
			say(creep,'quiting');
		}
		return true;
	}
	else{
		say(creep,'bye');                        
		cleanFlag(creep, Game.flags[creep.memory.flag]);
		creep.memory.flag = '';
		return false;
	}
}

function mining(creep){
	var sources = helper.get_sources(creep);
	if(sources){
		//say(creep,sources.pos.x +'/'+sources.pos.y);
		return creep.harvest(sources);
	}
	else{
		say(creep,'null🔄');
	}
}

function nearFlag(creep){
	if(Game.flags[creep.memory.flag].pos.x == creep.pos.x){
		if(Game.flags[creep.memory.flag].pos.y == creep.pos.y){
			return true;
		}
	}
	return false;
}

function find_flag(dist, creep, colorTarget){
	var flag = creep.pos.findInRange(FIND_FLAGS, dist,{
            filter: (f) => {
                return f.color == colorTarget 
				& (!f.memory.owner || f.memory.owner == _FLAGNULL);
            }
	});
	
	if(flag.length > 0){	
		setupFlag(creep, flag[0]);	
		return true;
	}
	
	return false;
	
}

function setupFlag(creep, flag){
	var oldFlag = Game.flags[creep.memory.flag];
	
	creep.memory.flag = flag.name;
	flag.memory.owner = creep.name;	
	
	cleanFlag(creep, oldFlag);
}

function cleanFlag(creep, oldFlag){
	if(oldFlag){
		//console.log(creep.name + ' cleaning ' + oldFlag.owner);
		oldFlag.owner = _FLAGNULL;
		Memory.flags[oldFlag.name].owner = _FLAGNULL;
		//console.log('result ' + oldFlag.name + ' onwer: ' + oldFlag.owner);
	}
	else{
		//console.log(creep.name + ' didnt have flag');
	}
}

module.exports = main;