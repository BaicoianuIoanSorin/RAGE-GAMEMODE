// make events that CEF will communicate with for getting thursty level and hunger level
// or make a render that will send these variables every 1 minute for example from client to CEF
import { PlayersVariables } from '@shared/player/PlayerVariables';
import { ThirstyHungerEvents } from '@shared/thirsty-hunger/events.constants';
import { ThirstyHungerLevelModel } from '@shared/thirsty-hunger/model';
import * as rpc from 'rage-rpc';

// mp.events.add('render', () => {

//     setTimeout(() => {
//         mp.console.logInfo(`Sending ${ThirstyHungerEvents.CEF_GET_HUNGRY_AND_THIRSTY_LEVEL} with values: ${mp.players.local.getVariable('thurstyLevel')} and ${mp.players.local.getVariable('hungryLevel')} at ${new Date().toLocaleTimeString()} `)
//         let thirstyHungerLevelModel = {
//             // move these getters to use db instead of player variables
//             thirstyLevel: mp.players.local.getVariable(PlayersVariables.HungryLevel),
//             hungryLevel: mp.players.local.getVariable(PlayersVariables.ThirstyLevel)
//         } as ThirstyHungerLevelModel;
//         rpc.callBrowsers(ThirstyHungerEvents.CEF_GET_HUNGRY_AND_THIRSTY_LEVEL, JSON.stringify(thirstyHungerLevelModel));
//     }, 36000);
// });