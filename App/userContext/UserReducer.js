export const UserReducer = (state, action) => {
    switch (action.type) {
        case 'SET_USER':
            return { ...state, user: action.payload };
        case 'SET_GAMES':
            return { ...state, games: action.payload };
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        case 'SET_LOGOUT':
            return { ...state, user: {} }
        case 'ADD_CREW_MEMBER':
            const { games } = state.user;
            games[action.payload.gameID] === undefined ? games[action.payload.gameID] = [] : null;
            games[action.payload.gameID].push(action.payload.crewMember)
            return { ...state, user: { ...state.user, games: { ...games } } }
        case 'DELETE_CREW_MEMBER':
            const filteredArray = state.user.games[action.payload.gameId].filter(
                crewMember => crewMember.id !== action.payload.crewMember.id
            )
            const gameListUpdated = { [state.user.games[action.payload.gameId]]: filteredArray }
            return { ...state, user: { ...state.user, games: { ...games, ...gameListUpdated } } };

        case 'UPDATE_USER':
            console.log({ ...state, user: { ...state.user, ...action.payload } })
            return { ...state, user: { ...state.user, ...action.payload } }
        default:
            return state;
    }
};