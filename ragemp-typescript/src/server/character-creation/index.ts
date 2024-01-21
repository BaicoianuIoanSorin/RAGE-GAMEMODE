import { AppDataSource } from '@/typeorm/typeorm';
import { CreatorEvents } from '@shared/character-creation/events.constants';
import { Character } from '@shared/entity/Character';
import { User } from '@shared/entity/User';
import * as rpc from 'rage-rpc';

const userRepository = AppDataSource.getRepository(User);
const characterRepository = AppDataSource.getRepository(Character);

rpc.register(CreatorEvents.SERVER_CHECK_IF_CHARACTER_EXISTS, async (playerId: number) => {
	const user: User | null = await userRepository.findOneBy({ username: mp.players.at(playerId).name });
	if (!user) {
		return false;
	}

	const character: Character | null = await characterRepository.findOneBy({ user: user });
	if (!character) {
		return false;
	}

	return true;
});
