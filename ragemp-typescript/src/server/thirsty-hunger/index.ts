import { AppDataSource } from '@/typeorm/typeorm';
import { ThirstyHunger } from '@shared/entity/ThirstyHunger';
import { PlayersVariables } from '@shared/player/PlayerVariables';
import { ThirstyHungerEvents } from '@shared/thirsty-hunger/events.constants';
import { ThirstyHungerLevelModel } from '@shared/thirsty-hunger/model';
import * as rpc from 'rage-rpc';

const thirstyHungerRepository = AppDataSource.getRepository(ThirstyHunger);

rpc.register(ThirstyHungerEvents.SERVER_GET_HUNGRY_AND_THIRSTY_LEVEL, async (message, info) => {
    const userId = info.player.getVariable(PlayersVariables.serverId);

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