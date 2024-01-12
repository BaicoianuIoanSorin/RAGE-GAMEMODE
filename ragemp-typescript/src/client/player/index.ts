import { IPlayerInfo } from '@shared/player/IPlayerInfo';
import { CLIENT_PLAYER_EVENTS } from '@shared/player/events.constants';
import * as rpc from 'rage-rpc';

rpc.register(CLIENT_PLAYER_EVENTS.GET_PLAYER_INFO, () => {
    const player: PlayerMp = mp.players.local;
    
    mp.console.logInfo(player.name);
    mp.console.logInfo(CLIENT_PLAYER_EVENTS.GET_PLAYER_INFO);
    return JSON.stringify({
        username: player.name,
        currentId: player.id,
    } as IPlayerInfo);
});
