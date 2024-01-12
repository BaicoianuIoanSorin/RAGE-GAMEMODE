import { CLIENT_CONSOLE_EVENTS } from '@shared/ragemp-library/client/console/events.constants';

mp.events.add(CLIENT_CONSOLE_EVENTS.CONSOLE_COMMAND, (command) => {
	switch (command) {
		case 'reload browser': {
			let browser = mp.browsers.at(0);
			browser.reload(true);
			mp.console.logInfo('Reloaded browser.');
		}
	}
});
