import React, { createContext, useReducer } from 'react';
import { UserReducer } from './UserReducer';

const initialState = {
    user: {},
    games: [],
    loading: true,
}

const userContext = createContext(initialState);
const { Provider } = userContext;


const StateProvider = ({ children }) => {
    const [state, dispatch] = useReducer(UserReducer, initialState);

    const setUser = user => {
        dispatch({
            type: 'SET_USER',
            payload: user
        });
    }

    const updateUser = (name, userName) => {
        dispatch({
            type: 'UPDATE_USER',
            payload: { name, userName }
        });
    }

    const setGames = games => {
        dispatch({
            type: 'SET_GAMES',
            payload: games
        });
    }

    const setLoading = loading => {
        dispatch({
            type: 'SET_LOADING',
            payload: loading
        });
    }

    const setLogOut = () => {
        dispatch({
            type: 'SET_LOGOUT'
        })
    }

    const updateCrewMembers = crewMember => {
        dispatch({
            type: 'ADD_CREW_MEMBER',
            payload: crewMember
        })
    }

    const deleteCrewMember = (gameId, crewMember) => {
        dispatch({
            type: 'DELETE_CREW_MEMBER',
            payload: { gameId, crewMember }
        })
    }

    return <Provider value={{ state, setUser, setGames, setLoading, setLogOut, updateCrewMembers, deleteCrewMember, updateUser }}>{children}</Provider>;
};

export { userContext, StateProvider };


export const withGlobalContext = ChildComponent => props => (
    <userContext.Consumer>
        {
            context => <ChildComponent {...props} global={context} />
        }
    </userContext.Consumer>
);