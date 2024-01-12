declare global {
	interface MySQL {
		host: string;
		user: string;
		password: string;
		database: string;
		connect(): void;
	}
}
