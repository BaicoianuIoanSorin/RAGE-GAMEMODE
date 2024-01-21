

const player = mp.players.local;
let customizationCEF = null, 
    customizatorOpened = false,
    bodyCam = null,
    bodyCamStart = null;

const genders = [  ];

getCameraOffset = (pos, angle, dist) => {
    angle = angle * 0.0174533;
    pos.y = pos.y + dist * Math.sin(angle);
    pos.x = pos.x + dist * Math.cos(angle);
    return pos;
}

mp.events.add({

    'client:creator.show': () => {
        player.freezePosition(true);
        if (customizatorOpened == true) return;
        customizationCEF = mp.browsers.new('package://player/creator/creator-interface/creator.html');
        setTimeout(() => { mp.gui.cursor.show(true, true); }, 500);
        mp.game.ui.displayRadar(false);
        mp.events.call('client:creator.cam', true);
        customizatorOpened = true;
        mp.gui.chat.activate(false);
        player.setComponentVariation(11, 15, 0, 0);
        player.setComponentVariation(3, 15, 0, 0);
        player.setComponentVariation(8, 15, 0, 0);
    },

    'client:creator.cam': (toggle) => {
        if (toggle) {
            bodyCamStart = player.position;
            let camValues = { Angle: player.getRotation(2).z + 90, Dist: 2.6, Height: 0.2 };
            let pos = getCameraOffset(new mp.Vector3(bodyCamStart.x, bodyCamStart.y, bodyCamStart.z + camValues.Height), camValues.Angle, camValues.Dist);
            bodyCam = mp.cameras.new('default', pos, new mp.Vector3(0, 0, 0), 50);
            bodyCam.pointAtCoord(bodyCamStart.x, bodyCamStart.y, bodyCamStart.z + camValues.Height);
            bodyCam.setActive(true);
            mp.game.cam.renderScriptCams(true, false, 500, true, false);
        }
        else {
            if (bodyCam == null) return;
            bodyCam.setActive(false);
            bodyCam.destroy();
            mp.game.cam.renderScriptCams(false, false, 3000, true, true);
            
            bodyCam = null;
        }
	    player.taskPlayAnim("amb@world_human_guard_patrol@male@base", "base", 8.0, 1, -1, 1, 0.0, false, false, false);
    },

    'client:creator.cam.set': (flag) => {
        let camValues = { Angle: 0, Dist: 1, Height: 0.2 };
        switch(flag)
        {
            case 0: // Torso
            {
                camValues = { Angle: 0, Dist: 2.6, Height: 0.2 };
                break;
            }
            case 1: // Head
            {
                camValues = { Angle: 0, Dist: 1, Height: 0.5 };
                break;
            }
            case 2: // Hair / Bear / Eyebrows
            {
                camValues = { Angle: 0, Dist: 0.5, Height: 0.7 };
                break;
            }
            case 3: // chesthair
            {
                camValues = { Angle: 0, Dist: 1, Height: 0.2 };
                break;
            }
        }
	    const camPos = getCameraOffset(new mp.Vector3(bodyCamStart.x, bodyCamStart.y, bodyCamStart.z + camValues.Height), player.getRotation(2).z + 90 + camValues.Angle, camValues.Dist);
        bodyCam.setCoord(camPos.x, camPos.y, camPos.z);
	    bodyCam.pointAtCoord(bodyCamStart.x, bodyCamStart.y, bodyCamStart.z + camValues.Height);
    },

    'client:creator.reload': () => { 
        player.setComponentVariation(11, 15, 0, 0);
        player.setComponentVariation(3, 15, 0, 0);
        player.setComponentVariation(8, 15, 0, 0);
        let shirt = player.getNumberOfDrawableVariations(11), bottom = player.getNumberOfDrawableVariations(4), shoes = player.getNumberOfDrawableVariations(6);
        customizationCEF.execute(`customization.max([${shirt}, ${bottom}, ${shoes}]);`);
    },

    'client:creator.finish': (character) => { 
        mp.events.call('client:creator.cam', false);
        if (mp.browsers.exists(customizationCEF)) { customizationCEF.destroy() }
        customizatorOpened = false;
        mp.events.callRemote('server:create.character', character);
        mp.game.ui.displayRadar(true);
        setTimeout(() => { mp.gui.cursor.show(false, false); }, 500);
        player.freezePosition(false);
        mp.gui.chat.activate(true);
        mp.events.call('client:hud.show', true);
    },

    'client:creator.preview': (x, data) => { 
        data = JSON.parse(data);

        switch (x) { 
            case 'hair': {
                mp.events.call('client:creator.cam.set', 2);
                if (data[0] == 23 || data[0] == 24) return false;
                player.setComponentVariation(2, parseInt(data[0]), 0, 0);
                player.setHairColor(parseInt(data[1]), parseInt(data[2]));
                break;
            }
            case 'faceFeatures': { 
                mp.events.call('client:creator.cam.set', 2);
                break;
            }
            case 'gender': { 
                mp.players.local.model = genders[data];
                break;
            }
            case 'beard': {
                mp.events.call('client:creator.cam.set', 2);
                break;
            }
            case 'blendData': { 
                mp.events.call('client:creator.cam.set', 1);
                break;
            }
            case 'clothing': { 
                mp.events.call('client:creator.cam.set', 0);
                player.setComponentVariation(11, parseInt(data[0][0]), parseInt(data[0][1]), 0);
                player.setComponentVariation(8, parseInt(data[1][0]), parseInt(data[1][1]), 0);
                player.setComponentVariation(4, parseInt(data[2][0]), parseInt(data[2][1]), 0);
                player.setComponentVariation(6, parseInt(data[3][0]), parseInt(data[3][1]), 0);
                break;
            }
            case 'headOverlays': { 
                mp.events.call('client:creator.cam.set', 2);
                player.setHeadOverlay(0, parseInt(data[0]), 1.0, 0, 0);
                player.setHeadOverlay(2, parseInt(data[1]), 1.0, 0, 0);
                player.setHeadOverlay(3, parseInt(data[2]), 1.0, 0, 0);
                player.setHeadOverlay(6, parseInt(data[5]), 1.0, 0, 0);
                player.setHeadOverlay(7, parseInt(data[6]), 1.0, 0, 0);
                player.setHeadOverlay(9, parseInt(data[8]), 1.0, 0, 0);
                if (player.model == genders[1]) { 
                    player.setHeadOverlay(5, parseInt(data[4]), 1.0, 0, 0);
                    player.setHeadOverlay(8, parseInt(data[7]), 1.0, 0, 0);
                    player.setHeadOverlay(4, parseInt(data[3]), 1.0, 0, 0);
                }
            }0
        }
    },

    'render': () => { 
        if (customizatorOpened) { 
            
        }
    }
});

