import {createSlice, createAsyncThunk, createEntityAdapter} from '@reduxjs/toolkit';
import {useHttp} from '../../hooks/http.hook';

const heroesAdapter = createEntityAdapter(); // Вернется объект с готовыми методами , коллбэками и мемоизированные селекторы тд
                                                      //* Добавляем кастомное свойство
const initialState = heroesAdapter.getInitialState( {heroesLoadingStatus: 'idle'} ); // return {entities:{}, ids:[]}

export const fetchHeroes = createAsyncThunk(
    'heroes/fetchHeroes', 
    async (type, payloadCreator) => {
        const {request} = useHttp(); 
        return await request('http://localhost:3001/heroes') 
    }
);
const heroesSlice = createSlice({
    name: 'heroes',
    initialState,
    reducers: {
        heroCreated: (state, action) => {
            // state.heroes.push(action.payload);
            heroesAdapter.addOne(state, action.payload);
        },
        heroDeleted: (state, action) => {
            //state.heroes = state.heroes.filter(item => item.id !== action.payload);
            heroesAdapter.removeOne(state, action.payload);
        },
    },
    extraReducers: (builder) => {
        builder 
            .addCase(fetchHeroes.pending,  state => {state.heroesLoadingStatus = 'loading'})
            .addCase(fetchHeroes.fulfilled, (state, action) => {
                        state.heroesLoadingStatus = 'idle';
                        //state.heroes = action.payload; // сюда придут данные полученные с запроса автоматически
                        heroesAdapter.setAll(state, action.payload); // готовый функционал из адаптера
            })
            .addCase(fetchHeroes.rejected, state => {state.heroesLoadingStatus = 'error'})
            .addDefaultCase(()=>{})
    }

});

const {actions, reducer} = heroesSlice;
export default reducer;
export const {selectAll} = heroesAdapter.getSelectors(state => state.heroes)
export const {
    heroesFetching,
    heroesFetched,
    heroesFetchingError,
    heroCreated,
    heroDeleted,
} = actions;