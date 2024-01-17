import { ChatEvents } from '@shared/chat/events.constants';
import { Commands } from '@shared/player/commands';
import * as rpc from 'rage-rpc';

// TODO maybe make it register such that it can send back to the UI any changes, or if the command is possible
rpc.register(ChatEvents.CHAT_COMMAND, async (command) => {
    if(!command) return;
    
    const parts = command.split(' ');
    const commandName = parts[0].substring(1);
    const args = parts.slice(1);
    
    // sometimes fail to call the server, so we need to check if the command is valid with a source of truth Command
    const commandValue = Object.values(Commands);
    if(!commandValue.includes(commandName)) {
        mp.console.logError(`${ChatEvents.CHAT_COMMAND} -> commandName: ${commandName}, args: ${args} does not exist`);
        return {
            title: 'Chat Command',
            status: 'error',
            description: `Command ${commandName} does not exist`
        };
    }
    mp.console.logInfo(`${ChatEvents.CHAT_COMMAND} -> commandName: ${commandName}, args: ${args}`);
    return await rpc.callServer(commandName, JSON.stringify(args));
});