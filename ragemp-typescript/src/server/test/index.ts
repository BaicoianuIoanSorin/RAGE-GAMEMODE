// THIS RESOURCE HAS ONLY METHODS FOR TESTING
import { SKY_CAMERA } from "@shared/position-savings/events.constants";
mp.events.addCommand('movecam', (player) => {
    // Make camera to go up in to the sky
    player.call(SKY_CAMERA.MOVE_SKY_CAMERA, [player, 'up', 1, false]);

    // After 5 seconds, camera start to go back to player.
    setTimeout(() => {
        player.position = new mp.Vector3(0,0,10); // Set your position if you want
        player.call(SKY_CAMERA.MOVE_SKY_CAMERA, [player, 'down']);
    }, 5000);
});

