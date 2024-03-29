import { CameraInformation } from '@shared/camera/model';
import { CAMERA_EVENTS } from '@shared/position-savings/events.constants';
import * as rpc from 'rage-rpc';

const controlsIds = {
	F5: 327,
	W: 32, // 232
	S: 33, // 31, 219, 233, 268, 269
	A: 34, // 234
	D: 35, // 30, 218, 235, 266, 267
	Space: 321,
	LCtrl: 326
};

let fly = {
	flying: false,
	f: 2.0,
	w: 2.0,
	h: 2.0,
	point_distance: 1000
};
let gameplayCam: CameraMp = mp.cameras.new('gameplay');

mp.game.graphics.notify('~r~Fly script loaded!');
mp.game.graphics.notify('~r~F5~w~ - enable/disable\n~r~F5+Space~w~ - disable without warping to ground\n~r~W/A/S/D/Space/LCtrl~w~ - move');
mp.game.graphics.notify('~r~/savecam~w~ - save Camera position.');

let direction: Vector3;
let coords: Vector3;

function pointingAt(distance: number) {
	const farAway = new mp.Vector3(direction.x * distance + coords.x, direction.y * distance + coords.y, direction.z * distance + coords.z);

	const result = mp.raycasting.testPointToPoint(coords, farAway, [], [1, 16]);
	return result;
}

mp.events.add('render', () => {
	const controls = mp.game.controls;
	direction = gameplayCam.getDirection();
	coords = gameplayCam.getCoord();

	mp.game.graphics.drawText(`Coords: ${JSON.stringify(coords)}`, [0.5, 0.005], {
		font: 0,
		color: [255, 255, 255, 185],
		scale: [0.3, 0.3],
		outline: true
	});
	let pointingAtPosition = pointingAt(fly.point_distance) ? pointingAt(fly.point_distance).position : 'undefined';

	mp.game.graphics.drawText(`pointAtCoord: ${JSON.stringify(pointingAtPosition)}`, [0.5, 0.025], {
		font: 0,
		color: [255, 255, 255, 185],
		scale: [0.3, 0.3],
		outline: true
	});

	if (controls.isControlJustPressed(0, controlsIds.F5)) {
		fly.flying = !fly.flying;

		const player = mp.players.local;

		player.setInvincible(fly.flying);
		player.freezePosition(fly.flying);
		player.setAlpha(fly.flying ? 0 : 255);

		if (!fly.flying && !controls.isControlPressed(0, controlsIds.Space)) {
			const position = mp.players.local.position;
			position.z = mp.game.gameplay.getGroundZFor3dCoord(position.x, position.y, position.z, false, false);
			mp.players.local.setCoordsNoOffset(position.x, position.y, position.z, false, false, false);
		}

		mp.game.graphics.notify(fly.flying ? 'Fly: ~g~Enabled' : 'Fly: ~r~Disabled');
	} else if (fly.flying) {
		let updated = false;
		const position = mp.players.local.position;

		if (controls.isControlPressed(0, controlsIds.W)) {
			if (fly.f < 8.0) {
				fly.f *= 1.025;
			}

			position.x += direction.x * fly.f;
			position.y += direction.y * fly.f;
			position.z += direction.z * fly.f;
			updated = true;
		} else if (controls.isControlPressed(0, controlsIds.S)) {
			if (fly.f < 8.0) {
				fly.f *= 1.025;
			}

			position.x -= direction.x * fly.f;
			position.y -= direction.y * fly.f;
			position.z -= direction.z * fly.f;
			updated = true;
		} else {
			fly.f = 2.0;
		}

		if (controls.isControlPressed(0, controlsIds.A)) {
			if (fly.w < 8.0) {
				fly.w *= 1.025;
			}

			position.x += -direction.y * fly.w;
			position.y += direction.x * fly.w;
			updated = true;
		} else if (controls.isControlPressed(0, controlsIds.D)) {
			if (fly.w < 8.0) {
				fly.w *= 1.05;
			}

			position.x -= -direction.y * fly.w;
			position.y -= direction.x * fly.w;
			updated = true;
		} else {
			fly.w = 2.0;
		}

		if (controls.isControlPressed(0, controlsIds.Space)) {
			if (fly.h < 8.0) {
				fly.h *= 1.025;
			}

			position.z += fly.h;
			updated = true;
		} else if (controls.isControlPressed(0, controlsIds.LCtrl)) {
			if (fly.h < 8.0) {
				fly.h *= 1.05;
			}

			position.z -= fly.h;
			updated = true;
		} else {
			fly.h = 2.0;
		}

		if (updated) {
			mp.players.local.setCoordsNoOffset(position.x, position.y, position.z, false, false, false);
		}
	}
});

rpc.register(CAMERA_EVENTS.GET_CAM_COORDS, async (name) => {
    mp.console.logInfo(`${CAMERA_EVENTS.GET_CAM_COORDS} -> ${name}`);
    
	let cameraInformation: CameraInformation = {
		position: coords,
		pointAtCoord: JSON.stringify(pointingAt(fly.point_distance)),
		name: name
	};
	return await rpc.callServer(CAMERA_EVENTS.SAVE_CAM_COORDS, JSON.stringify(cameraInformation));
});
