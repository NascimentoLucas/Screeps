var helper = require('helper');
var tool = require('tool.creep');

var _FLAGNULL = '_FLAGNULL';

var main = {

    /** @param {Creep} creep **/
    get_sources: function(creep) {	
		if(Game.flags[creep.memory.flag]){
			if(nearFlag(creep)){
				if(creep.carry.energy < creep.carryCapacity) {
					var r = mining(creep);
					
					if(r == OK){	
					}
					else if(r == ERR_NOT_IN_RANGE){					
						if(findFlag(creep, Game.flags[creep.memory.flag].color - 1)){
							say(creep, creep.memory.count);					
							return true;
						}
						else{
							say(creep, Game.flags[creep.memory.flag].color - 1);	
							return Game.flags[creep.memory.flag].color > COLOR_YELLOW;							
							//console.log('did not find NEW flag.color: ' + (Game.flags[creep.memory.flag].color - 1));
						}
					}
				}
				else{					
                    return go_to_exit(creep);					
				}
				
			}
			else{
				say(creep,'gt:' + Game.flags[creep.memory.flag].name);				
				tool.moveTo(creep, Game.flags[creep.memory.flag]);
			}
			return true;
		}
		else{
			//console.log('looking for flag');
			findFlag(creep, COLOR_WHITE);				
			const look = creep.pos.look();
			look.forEach(function(lookObject) {
				if(lookObject.type == LOOK_FLAGS) {
					console.log(creep.name + ' moving to mainSpawn');
					tool.moveTo(creep, Game.getObjectById(Memory.mainSpawn));
				}
			});
			say(creep, 'w');
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
	if (Game.flags[creep.memory.flag].color > COLOR_YELLOW){
		if(findFlag(creep, Game.flags[creep.memory.flag].color - 1)){
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
	
function findFlag(creep, colorTarget){
	var flag = creep.pos.findClosestByRange(FIND_FLAGS, {
            filter: (f) => {
                return f.color == colorTarget 
				& (!f.memory.owner || f.memory.owner == _FLAGNULL);
            }
	});
	
	if(flag){		
		setupFlag(creep, flag);	
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