var helper = require('helper');
var tool = require('tool.creep');

var _FLAGNULL = '_FLAGNULL';

var main = {

    /** @param {Creep} creep **/
    get_sources: function(creep) {	
		tool.clean_floor(creep);
		if(Game.flags[creep.memory.flag]){
			if(nearFlag(creep)){
				if(creep.carry.energy < creep.carryCapacity) {
					var r = mining(creep);
					
					if(r == OK){	
					}
					else if(r == ERR_NOT_IN_RANGE){					
						if(findFlag(creep, Game.flags[creep.memory.flag].color - 1)){
							creep.say('O.O flag');					
							return true;
						}
						else{	
							creep.say('w c' + (Game.flags[creep.memory.flag].color - 1) + ' Flag');		
							//console.log('did not find NEW flag.color: ' + (Game.flags[creep.memory.flag].color - 1));
						}
					}
				}
				else{
					
                    if (Game.flags[creep.memory.flag].color > COLOR_YELLOW){
                        if(findFlag(creep, Game.flags[creep.memory.flag].color - 1)){
                            creep.say('exit');
                        }
                    }
                    else{
                        creep.say('bye');                        
                        cleanFlag(creep, Game.flags[creep.memory.flag]);
                        creep.memory.flag = '';
                        return false;
                    }
					
				}
				
			}
			else{
				creep.say('gt:' + Game.flags[creep.memory.flag].name);				
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
			creep.say('w white Flag');
			return true;
		}	
		return false;
	}
}

function mining(creep){
	var sources = helper.get_sources(creep);
	if(sources){
		//creep.say(sources.pos.x +'/'+sources.pos.y);
		return creep.harvest(sources);
	}
	else{
		creep.say('null🔄');
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