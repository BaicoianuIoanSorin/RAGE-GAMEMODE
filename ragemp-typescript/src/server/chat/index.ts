import { ChatEvents } from '@shared/chat/events.constants';
import { ChatMessage } from '@shared/chat/model';
import * as rpc from 'rage-rpc';

const range: number = 15;

rpc.register(ChatEvents.SERVER_CHAT_MESSAGE, (chatMessageJSON) => {
    console.log(`${ChatEvents.SERVER_CHAT_MESSAGE} -> chatMessageJSON: ${chatMessageJSON}`);

    const chatMessage: ChatMessage = JSON.parse(chatMessageJSON);

    const player: PlayerMp = mp.players.at(chatMessage.playerId);
    if(!player) return;

    console.log(`${ChatEvents.SERVER_CHAT_MESSAGE} -> player.name: ${player.name}`);
    
    mp.players.forEachInRange(player.position, range, (playerInRange) => {
        rpc.callClient(playerInRange, ChatEvents.CLIENT_RECEIVE_MESSAGE, chatMessageJSON);
    });
});