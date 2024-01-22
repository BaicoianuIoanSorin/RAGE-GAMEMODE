declare global {
	interface PlayerMp {
		customProperty: number;

		updateControls(enable: boolean, controls: number[]): void;
	}
}

export {};
