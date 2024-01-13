export function findPlayerByName(name: string): PlayerMp | undefined {
    return mp.players.toArray().find(player => player.name === name);
}