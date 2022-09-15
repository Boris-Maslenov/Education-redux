import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {useHttp} from '../../hooks/http.hook';

const initialState = {
    heroes: [],
    heroesLoadingStatus: 'idle',
}

export const fetchHeroes = createAsyncThunk( // тут вернутся не 1 action Creator а 3!! Которые описывают состояние нашего промиса
    'heroes/fetchHeroes', 
    async (type, payloadCreator) => {
        //Обязательно должна вернуть Promise/ Иначе вручную создавать ошибку
        const {request} = useHttp(); // если функция обернуты в callback то работать не будет!
        // В нашем случае можно без async/await
        return await request('http://localhost:3001/heroes') 
    }
);

// createSlice вернет 3 сущности:
// 1. Имя среза
// 2. Объект с actions
// 3. Reducer
const heroesSlice = createSlice({
    name: 'heroes',
    initialState,
    reducers: {

        // heroesFetching: state => {
        // state.heroesLoadingStatus = 'loading';
        // },
        // heroesFetched: (state, action) => {
        //     state.heroesLoadingStatus = 'idle';
        //     state.heroes = action.payload;
        // },
        // heroesFetchingError: state => {state.heroesLoadingStatus = 'error'},
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

    },
    extraReducers: (builder) => {
        builder 
            .addCase(fetchHeroes.pending,  state => {state.heroesLoadingStatus = 'loading'})
            .addCase(fetchHeroes.fulfilled, (state, action) => {
                        state.heroesLoadingStatus = 'idle';
                        state.heroes = action.payload; // сюда придут данные полученные с запроса автоматически
            })
            .addCase(fetchHeroes.rejected, state => {state.heroesLoadingStatus = 'error'})
            .addDefaultCase(()=>{})
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