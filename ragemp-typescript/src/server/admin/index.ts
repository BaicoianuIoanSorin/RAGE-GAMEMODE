import { ChatEvents } from '@shared/chat/events.constants';
import { ChatMessage, TypeMessage } from '@shared/chat/model';
import { PlayersVariables } from '@shared/player/PlayerVariables';
import { AdminChatCommands } from '@shared/player/commands';
import * as rpc from 'rage-rpc';

rpc.register(AdminChatCommands.ADMIN_CHAT, async (messageJSON, info) => {
    console.log(`Commands: ${AdminChatCommands.ADMIN_CHAT} ${messageJSON}`);

    let message: string[] = JSON.parse(messageJSON);

    if(info.player.getVariable(PlayersVariables.Admin) === 0) {
        return {
            title: 'Admin Chat',
            status: 'error',
            description: `You are not an admin.`
        };
    }

    const chatMessage: ChatMessage = {
        playerId: info.player.id,
        playerName: info.player.name,
        time: new Date().toLocaleTimeString(),
        message: message[0],
        typeMessage: TypeMessage.ADMIN,
    };

    mp.players.forEach((player) => {
        if(player.getVariable(PlayersVariables.Admin) > 0) {
            rpc.callClient(player, ChatEvents.CLIENT_RECEIVE_MESSAGE, JSON.stringify(chatMessage));
        }
    });

    // don't send back to the UI
    return undefined;
});

rpc.register(AdminChatCommands.MAKE_ADMIN, (command) => {
    // TODO maybe add some toast back to the UI to let the player know that the admin level has been changed
    // TODO maybe add some toast back to the UI to let the player that wants to change the admin level know that the admin level has been changed
    // TODO maybe add some toast back to the UI to let the player that wants to change th admin level know that player is not connected

    console.log(`Commands: ${AdminChatCommands.ADMIN_CHAT} ${command}`);
    // if(!mp.players.exists(playerId)) return;

    // mp.players.at(playerId).setVariable('admin', adminLevel);

    // // TODO add typeORM query to save the admin level to the database
    // console.log(`${AdminEvents.MAKE_ADMIN} Admin level of player ${playerId} has been changed to ${adminLevel}.`)
});