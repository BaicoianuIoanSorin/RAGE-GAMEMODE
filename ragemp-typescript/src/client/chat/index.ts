import { ChatEvents } from '@shared/chat/events.constants';
import { ChatMessage, TypeMessage } from '@shared/chat/model';
import { AdminChatCommands, getAllCommandsValues } from '@shared/player/commands';
import * as rpc from 'rage-rpc';

rpc.register(ChatEvents.CLIENT_CHAT_COMMAND, async (command) => {
    if(!command) return;

    const parts = command.split(' ');
    const commandName = parts[0].substring(1);
    
    let adminChatCommands = Object.values(AdminChatCommands);
    let args: string[] = [];

    if(adminChatCommands.includes(commandName)) {
        // get what is after the commandName as one argument
        args = [parts.slice(1).join(' ')];
    }
    else {
        // split the text after commandName in arguments
        args = parts.slice(1); 
    }

    if(!getAllCommandsValues().includes(commandName)) {
        mp.console.logError(`${ChatEvents.CLIENT_CHAT_COMMAND} -> commandName: ${commandName}, args: ${args} does not exist`);
        return {
            title: 'Chat Command',
            status: 'error',
            description: `Command ${commandName} does not exist`
        };
    }
    mp.console.logInfo(`${ChatEvents.CLIENT_CHAT_COMMAND} -> commandName: ${commandName}, args: ${args}`);
    return await rpc.callServer(commandName, JSON.stringify(args));
});

rpc.register(ChatEvents.CLIENT_CHAT_MESSAGE, async (message) => {
    mp.console.logInfo(`${ChatEvents.CLIENT_CHAT_MESSAGE} -> message: ${message}`);

    const chatMessage: ChatMessage = {
        playerId: mp.players.local.id,
        playerName: mp.players.local.name,
        time: new Date().toLocaleTimeString(),
        message: message,
        typeMessage: TypeMessage.NORMAL,
    };
    
    await rpc.callServer(ChatEvents.SERVER_CHAT_MESSAGE, JSON.stringify(chatMessage));
})

rpc.register(ChatEvents.CLIENT_RECEIVE_MESSAGE, async (chatMessageJSON) => {
    mp.console.logInfo(`${ChatEvents.CLIENT_RECEIVE_MESSAGE} -> chatMessageJSON: ${chatMessageJSON}`);
    
    await rpc.callBrowser(mp.browsers.at(0), ChatEvents.CEF_RECEIVE_MESSAGE, chatMessageJSON);
});

// for typing
rpc.register(ChatEvents.CLIENT_TYPES_MESSAGE, () => {
    mp.gui.cursor.show(true, true);
})

rpc.register(ChatEvents.CLIENT_STOPPED_TYPING_MESSAGE, () => {

    // TODO when using ESC to close the chat, it also enters in the game settings
    // make such that it only closes the chat and not the game settings
    mp.gui.cursor.show(false, false);
});