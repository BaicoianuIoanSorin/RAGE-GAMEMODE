import { ChatEvents } from '@shared/chat/events.constants';
import * as rpc from 'rage-rpc';

// TODO maybe make it register such that it can send back to the UI any changes, or if the command is possible
rpc.on(ChatEvents.CHAT_COMMAND, (command) => {
    if(!command) return;
    mp.console.logInfo(`${ChatEvents.CHAT_COMMAND} ${command}`);
    
    const parts = command.split(' ');
    const commandName = parts[0].substring(1);
    const args = parts.slice(1);

    mp.console.logInfo(`${ChatEvents.CHAT_COMMAND} ${commandName} ${args}`);
    rpc.callServer(commandName, JSON.stringify(args));
});