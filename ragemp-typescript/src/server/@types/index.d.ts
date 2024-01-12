declare global {
	interface PlayerMp {
		customProperty: number;

		customMethod(): void;
	}

	interface MySQL {
		host: string;
		user: string;
		password: string;
		database: string;

		connect(): void;
		getHandler(): any;
	}
}

export {};
