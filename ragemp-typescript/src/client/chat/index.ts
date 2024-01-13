import { ChatEvents } from '@shared/chat/events.constants';
import * as rpc from 'rage-rpc';

// TODO maybe make it register such that it can send back to the UI any changes, or if the command is possible
rpc.register(ChatEvents.CHAT_COMMAND, async (command) => {
    if(!command) return;
    
    const parts = command.split(' ');
    const commandName = parts[0].substring(1);
    const args = parts.slice(1);

    mp.console.logInfo(`${ChatEvents.CHAT_COMMAND} -> commandName: ${commandName}, args: ${args}`);
    return await rpc.callServer(commandName, JSON.stringify(args));
});