import * as rpc from 'rage-rpc';
import { AUTH } from '@shared/authentication/events.constants';

rpc.register(AUTH.CLIENT_LOGIN, async (formFieldsJSON) => {
	let playerId = mp.players.local.id;
	let formFields = JSON.parse(formFieldsJSON);
	let formFieldsToServer = {
		playerId: playerId,
		email: formFields.email,
		password: formFields.password
	};
	let response = await rpc.callServer(AUTH.SERVER_LOGIN, JSON.stringify(formFieldsToServer));
	mp.console.logInfo(response);
	return response;
});