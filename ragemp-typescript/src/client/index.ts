import { PLAYER_CONSTANTS } from '@shared/ragemp-library/events.constants';
import { AUTH } from '@shared/authentication/events.constants';
import './position-savings';
import './auth';
import './sound';
import './player';
import './commands/utils';
import * as rpc from 'rage-rpc';
import { WINDOW_EVENTS, WINDOW_OPENED } from '@shared/window/windows.constants';

let browser : BrowserMp;

let player = mp.players.local;
mp.events.add(PLAYER_CONSTANTS.PLAYERS_READY, () => {
	mp.console.logInfo(`Client: ${player.name} is ready!`);

	browser = mp.browsers.new("http://localhost:3000");
	mp.players.local.freezePosition(true);
    mp.game.ui.setMinimapVisible(false);
    mp.gui.chat.activate(false);
	// TODO later it will be enabled browser.markAsChat();
    mp.gui.cursor.show(true, true);
	setTimeout(async () => {
		mp.gui.cursor.visible = true;
	  }, 0);
	mp.events.callRemote(AUTH.JOIN);
	rpc.triggerBrowser(browser, WINDOW_EVENTS.OPEN_WINDOW, WINDOW_OPENED.LOGIN);
	mp.console.logInfo(PLAYER_CONSTANTS.PLAYERS_READY);
});

rpc.on(AUTH.CLIENT_LOGIN_SUCCES, () => {
	mp.players.local.freezePosition(false);
	mp.game.ui.setMinimapVisible(true);
	mp.gui.cursor.show(false, false);
	setTimeout(() => {
		mp.events.callRemote(AUTH.SERVER_LOGIN_SUCCES);
		rpc.triggerBrowser(browser, WINDOW_EVENTS.CLOSE_WINDOW, WINDOW_OPENED.LOGIN);
	}, 3000);
	mp.console.logInfo(AUTH.CLIENT_LOGIN_SUCCES);
});