var helper = require('helper');
var tool = require('tool.creep');

var _FLAGNULL = '_FLAGNULL';

var color_limit = COLOR_YELLOW;

var main = {

    /** @param {Creep} creep **/
    get_sources: function(creep, first_flag_distance) {	
		//cleanFlag(creep, Game.flags[creep.memory.flag]);
		//return false;
		
		if(Game.flags[creep.memory.flag]){
			var flag = Game.flags[creep.memory.flag];
			if(nearFlag(creep)){
				if(creep.carry.energy < creep.carryCapacity) {
					var r = mining(creep);
					if(r == OK){	
					}
					else if(r == ERR_NOT_IN_RANGE){							
						if(find_flag(creep, flag.color - 1)){
							//say(creep, creep.memory.count);
							return true;
						}
						else{
							say(creep, Game.flags[creep.memory.flag].color - 1);	
							if(flag.color <= color_limit){								
								go_to_exit(creep);
							}
							//console.log('did not find NEW flag.color: ' + (Game.flags[creep.memory.flag].color - 1));
						}
					}
					else if (r || ERR_NOT_ENOUGH_RESOURCES){
					    return false;
					}
				}
				else{					
                    return go_to_exit(creep);					
				}
				
			}
			else{
				say(creep,'gt:' + flag.name);				
				tool.moveTo(creep, flag);
			}
			return true;
		}
		else{           
			say(creep, 'w');
            //console.log(creep.name + ' looking for flag');
            tool.check_above_flag(creep);                
            find_first_flag(creep, COLOR_WHITE);
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
	if (Game.flags[creep.memory.flag].color > color_limit){
		if(find_flag(creep, Game.flags[creep.memory.flag].color - 1)){
			say(creep,'quiting');
		}
		else{
			console.log(creep.name  + ' dont find flag maybe too far');
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

function find_first_flag(creep, colorTarget){			
	for(var flagName in Game.flags){
    	var flag = Game.flags[flagName];
    	    if(flag.color == colorTarget 
    	    & (!flag.memory.owner || flag.memory.owner == _FLAGNULL)){
    	        setupFlag(creep, flag);
				return true;
    	    }
    }
	
	return false;
}

function find_flag(creep, colorTarget){
	var flag = creep.pos.findInRange(FIND_FLAGS, 5,{
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