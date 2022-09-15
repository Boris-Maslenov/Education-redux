import {createSlice, nanoid} from '@reduxjs/toolkit';

const initialState = {
    heroes: [],
    heroesLoadingStatus: 'idle',
}

// createSlice вернет 3 сущности:
// 1. Имя среза
// 2. Объект с actions
// 3. Reducer
const heroesSlice = createSlice({
    name: 'heroes',
    initialState,
    reducers: {
        heroesFetching: state => {
        state.heroesLoadingStatus = 'loading';
        },
        heroesFetched: (state, action) => {
            state.heroesLoadingStatus = 'idle';
            state.heroes = action.payload;
        },
        heroesFetchingError: state => {state.heroesLoadingStatus = 'error'},
        heroCreated: (state, action) => {
            state.heroes.push(action.payload);
        },
        heroDeleted: (state, action) => {
            state.heroes = state.heroes.filter(item => item.id !== action.payload);
        },
        //* - вариант подготовки кастомного action если нужно подготовить свои какие-либо данные;
        //** - аргумент text придет а функция вернет action.payload и отправит в качестве аргумент в reducer (action);
        // addToDo: {
        //     reducer: (state, action) => {
        //         state.push(action.payload);
        //     },          //** 
        //     prepare: (text) {
        //             const id = nanoid();
        //             return {payload:{id,text}}
        //     }
        // }

    }

});

const {actions, reducer} = heroesSlice;
export default reducer;
export const {
    heroesFetching,
    heroesFetched,
    heroesFetchingError,
    heroCreated,
    heroDeleted,
} = actions;