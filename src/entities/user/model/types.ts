export interface IUser {
	id: string;
	username: string;
	avatar_url?: string;
	role: string;
}

export interface IUserCredentials {
	username: string;
	password: string;
}
