import { AppDataSource } from '@/typeorm/typeorm';
import { ThirstyHunger } from '@shared/entity/ThirstyHunger';
import { User } from '@shared/entity/User';
import { PlayersVariables } from '@shared/player/PlayerVariables';
import { ThirstyHungerEvents } from '@shared/thirsty-hunger/events.constants';
import { ThirstyHungerLevelModel } from '@shared/thirsty-hunger/model';
import * as rpc from 'rage-rpc';

const thirstyHungerRepository = AppDataSource.getRepository(ThirstyHunger);

rpc.register(ThirstyHungerEvents.SERVER_GET_HUNGRY_AND_THIRSTY_LEVEL, async (message, info) => {
    const userId = info.player.getVariable(PlayersVariables.serverId);
    console.log(`${ThirstyHungerEvents.SERVER_GET_HUNGRY_AND_THIRSTY_LEVEL} for user ${userId}`)
    
    try {
        const thirstyHunger = await thirstyHungerRepository.findOne({where: {user: userId}});

        if (!thirstyHunger) {
            console.log(`ThirstyHunger not found for user ${userId}`);
            return;
        }

        return {
            thirstyLevel: thirstyHunger.thirstyLevel,
            hungryLevel: thirstyHunger.hungryLevel
        } as ThirstyHungerLevelModel;
    }
   
    catch (error: any) {
        console.error(error);
        throw error;
    }
})

rpc.register(ThirstyHungerEvents.SERVER_UPDATE_HUNGRY_AND_THIRSTY_LEVEL, async (id) => {
    const userId = mp.players.at(id).getOwnVariable(PlayersVariables.serverId);
    console.log(`${ThirstyHungerEvents.SERVER_UPDATE_HUNGRY_AND_THIRSTY_LEVEL} for user ${userId}`)

    try {
        const thirstyHunger: ThirstyHunger | null = await thirstyHungerRepository.findOne({where: {user: userId}});
        if (!thirstyHunger) {
            console.log(`ThirstyHunger not found for user ${userId}`);
            return;
        }

        if(thirstyHunger.thirstyLevel > 0 && thirstyHunger.hungryLevel > 0) {
            thirstyHunger.thirstyLevel -= 5;
            thirstyHunger.hungryLevel -= 5;
        }
        else {
            thirstyHunger.thirstyLevel = 0;
            thirstyHunger.hungryLevel = 0;
            // TODO handle some events in the client side that will make the player die
        }

        await thirstyHungerRepository.update({id: thirstyHunger.id}, thirstyHunger);
        
        return {
            thirstyLevel: thirstyHunger.hungryLevel,
            hungryLevel: thirstyHunger.thirstyLevel
        } as ThirstyHungerLevelModel;
    }
    catch (error: any) {
        console.error(error);
        throw error;
    }
});