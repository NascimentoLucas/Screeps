var creepWorkParts = [{type: WORK, cost: 100}, {type: CARRY, cost: 50}, {type: MOVE, cost: 50}];
var creepFitherParts = [{type: RANGED_ATTACK, cost: 150}, {type: MOVE, cost: 50}, {type: TOUGH, cost: 10}];
var creepCost = 0;

var prefFitherParts = [0, 2, 2, 2, 2, 2, 1];
var prefWorkParts = [2, 0, 1, 2, 0];

var maxEnergy;
var nowEnergy;
var stru;


var main = {

    run: function (len, numberMaxCreeps, figther) {

        stru = Game.structures;
        maxEnergy = 0;
        nowEnergy = 0;

        if (len > 0)
        {
            for (const i in stru)
            {
                if ((stru[i].structureType == STRUCTURE_EXTENSION 
				|| stru[i].structureType == STRUCTURE_SPAWN) 
				& (stru[i].isActive() == true))
                {
                    maxEnergy += stru[i].energyCapacity;
                    nowEnergy += stru[i].energy;
                    //console.log(stru[i].energyCapacity + ": " + stru[i].isActive());
                }
            }
            maxEnergy *= 0.85;
        }
        else
        {
            maxEnergy = 250;
            for (const i in stru)
            {
                if ((stru[i].structureType == STRUCTURE_EXTENSION) 
					& (stru[i].isActive() == true))
                {
                    maxEnergy += stru[i].energy;
                    nowEnergy += stru[i].energy;
                }
            }
            for (const i in stru)
            {
                if ((stru[i].structureType == STRUCTURE_SPAWN) & (stru[i].isActive() == true))
                {
                    nowEnergy += stru[i].energy;
                }
            }
        maxEnergy = 200;
        }


        //console.log('energy: ' + nowEnergy + '/' + maxEnergy);

        if (nowEnergy >= maxEnergy)
        {
            spawn(len, numberMaxCreeps, false);
        }
        else
        {
            //console.log('have ' + len + '/' + numberMaxCreeps + ' creeps');
        }
        //buildCreep(maxEnergy);
    }
};

function buildCreep(m, creepParts, pref, standard) {
    //var standard = [creepParts[0].type, creepParts[1].type, creepParts[2].type];
    creepCost = creepParts[0].cost + creepParts[1].cost + creepParts[2].cost;
    //var pref = [2, 0, 2, 0, 1];
    var aux = 0;
    var temp;
    //console.log('budget Energy: ' + m);
    //m = 610;

	var attempts = -pref.length;
    while (creepCost < m)
    {
        temp = creepParts[pref[aux % pref.length]];
        creepCost += temp.cost;

        if (creepCost > m)
        {
            //console.log('dont add: ' + temp.type + ' for ' + temp.cost + ' total: ' + creepCost);
            creepCost -= temp.cost;
            if(attempts > 0){
				break;
			}
			else{
				attempts++;
			}
        }
        else if (creepCost < m)
        {
            standard.push(temp.type);
            //console.log('add: ' + temp.type + '(' + pref[aux % pref.length] + ') total: ' + creepCost);
        }
        else if (creepCost == m)
        {
            standard.push(temp.type);
            //console.log('add final: ' + temp.type + ' for ' + temp.cost + ' total: ' + creepCost);
            break;
        }
        aux++;
    }
	
    return standard;
}

function spawn(now, numberMaxCreeps, figther) {	
    var auxN = 0;
    if (now < numberMaxCreeps)
    {
		//console.log('++++++++++++++++++++++');
        var cont = ERR_NAME_EXISTS;
        var n = ('creep_' + auxN);
        var newCreep;

        if (figther)
        {
            newCreep = buildCreep(maxEnergy, creepFitherParts, prefFitherParts, [creepFitherParts[0].type, creepFitherParts[1].type, creepFitherParts[2].type]);
        }
        else
        {
            newCreep = buildCreep(maxEnergy, creepWorkParts, prefWorkParts, [creepWorkParts[0].type, creepWorkParts[1].type, creepWorkParts[2].type]);
        }


        for (const i in Game.spawns)
        {
            while (cont == ERR_NAME_EXISTS)
            {
                cont = Game.spawns[i].spawnCreep(newCreep, n, {memory: {behaviour: 0}});

                if (cont == OK)
                {
                    //console.log('Spawn: ' + n + ' ' + now + ' of ' + numberMaxCreeps);
					//console.log('++++++++++++++++++++++');
                    return true;
                }
                else if (cont == ERR_NAME_EXISTS)
                {
                    //console.log('ERR_NAME_EXISTS: ' + n);
                    auxN++;
                    n = ('creep_' + auxN);
                    //console.log('trying: ' + n);
                }
                else if (cont == ERR_NOT_ENOUGH_ENERGY)
                {
                    //console.log('ERR_NOT_ENOUGH_ENERGY for creep ');
                    return true;
                }
                else if (cont == ERR_BUSY)
                {
                    //console.log('ERR_BUSY : waiting');
                    return true;
                }
            }

            //console.log('feedback: ' + cont)
        }
    }
    else
    {
        return false;
    }
}


module.exports = main;