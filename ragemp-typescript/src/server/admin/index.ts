import { AdminEvents } from '@shared/admin/events.constants';
import * as rpc from 'rage-rpc';

rpc.register(AdminEvents.MAKE_ADMIN, (command) => {
    // TODO maybe add some toast back to the UI to let the player know that the admin level has been changed
    // TODO maybe add some toast back to the UI to let the player that wants to change the admin level know that the admin level has been changed
    // TODO maybe add some toast back to the UI to let the player that wants to change th admin level know that player is not connected

    console.log(`${AdminEvents.MAKE_ADMIN} ${command}`);
    // if(!mp.players.exists(playerId)) return;

    // mp.players.at(playerId).setVariable('admin', adminLevel);

    // // TODO add typeORM query to save the admin level to the database
    // console.log(`${AdminEvents.MAKE_ADMIN} Admin level of player ${playerId} has been changed to ${adminLevel}.`)
});