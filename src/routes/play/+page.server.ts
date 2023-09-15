export async function load({url}) {
    return {game_id: url.searchParams.get('game_id')};
}