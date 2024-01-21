import { PLAYER_CONSTANTS } from '@shared/ragemp-library/events.constants';
import { AUTH } from '@shared/authentication/events.constants';
import './position-savings';
import './auth';
import './sound';
import './player';
import './commands/utils';
import './chat';
import './thirsty-hunger';
import './character-creation';
import * as rpc from 'rage-rpc';
import { WINDOW_EVENTS, Window, WindowState } from '@shared/window/windows.constants';
import { ThirstyHungerEvents } from '@shared/thirsty-hunger/events.constants';
import { PlayersVariables } from '@shared/player/PlayerVariables';

let browser: BrowserMp;

let player = mp.players.local;

function createBrowser() {
    if (browser) return;

    browser = mp.browsers.new("http://localhost:3000");

}

function onBrowserReady(browser: BrowserMp) {
    if (browser.url !== browser.url) return;
    
    browser.markAsChat();
    mp.console.logInfo("Browser app loaded and marked as chat!");

	player.freezePosition(true);
	mp.game.ui.setMinimapVisible(false);
	mp.gui.cursor.show(true, true);
	setTimeout(async () => {
		mp.gui.cursor.visible = true;
	}, 0);
	mp.events.callRemote(AUTH.JOIN);
	rpc.triggerBrowser(browser, WINDOW_EVENTS.CHANGE_STATE_WINDOW, JSON.stringify([
		{
			windowName: Window.LOGIN,
			state: true
		},
	] as WindowState[]));
	mp.console.logInfo(PLAYER_CONSTANTS.PLAYERS_READY);
}

mp.events.add(PLAYER_CONSTANTS.PLAYERS_READY, () => {
    mp.console.logInfo(`Client: ${player.name} is ready!`);
    
    // disable default chat
    mp.gui.chat.show(false);
    mp.gui.chat.activate(false);

    // create our own browser and mark as chat
    createBrowser();
});

mp.events.add('browserDomReady', onBrowserReady);

rpc.on(AUTH.CLIENT_LOGIN_SUCCES, () => {
	player.freezePosition(false);
	mp.game.ui.setMinimapVisible(true);
	mp.gui.cursor.show(false, false);
	setTimeout(() => {
		mp.events.callRemote(AUTH.SERVER_LOGIN_SUCCES);
		rpc.triggerBrowser(browser, WINDOW_EVENTS.CHANGE_STATE_WINDOW, JSON.stringify([
			{
				windowName: Window.LOGIN,
				state: false
			},
		] as WindowState[]));
	}, 3000);
	mp.console.logInfo(AUTH.CLIENT_LOGIN_SUCCES);
});

let isIntervalSet = false;

mp.events.add('render', async () => {
    if (player.getVariable(PlayersVariables.isLoggedIn) && !isIntervalSet) {
		
		// updating and retrieving information about hungry and thirsty level
		const runTimerForGettinAndUpdatingHungryThirsty = 1 * 60 * 1000; // 3 minutes
		isIntervalSet = true;
        setInterval(async () => {
            const newThirstyHungryLevel = await rpc.callServer(ThirstyHungerEvents.SERVER_UPDATE_HUNGRY_AND_THIRSTY_LEVEL, mp.players.local.id);
            await rpc.callBrowsers(ThirstyHungerEvents.CEF_GET_HUNGRY_AND_THIRSTY_LEVEL, JSON.stringify(newThirstyHungryLevel));
        }, runTimerForGettinAndUpdatingHungryThirsty);

		// for chat messages
		if (mp.players.local.isTypingInTextChat) {
			mp.game.controls.disableAllControlActions(0);
			mp.game.controls.disableAllControlActions(1);
			mp.game.controls.disableAllControlActions(2);
		}
    }
});

