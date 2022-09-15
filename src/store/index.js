import {configureStore} from '@reduxjs/toolkit';
import heroes from '../components/heroesList/heroesSlice';
import filters from '../components/heroesFilters/filtersSlice';

                             // *       // **
const stringMiddleware  = (store) => (dispatch) => (action) => { 
    if(typeof action === 'string') {
        return dispatch({
            type: action
        })
    }
    return dispatch(action);
}

// * store первым аргументом не весь а только {dispatch, getState}
// ** - часто называют next, потому что идет последовательный вызов всех функций middleware

// const rootReducer = combineReducers({heroes, filters});
// const store = createStore(
//                     rootReducer, 
//                     compose(applyMiddleware(ReduxThunk, stringMiddleware), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
//                     );

const store = configureStore({
    reducer: {heroes, filters},
    devTools: process.env.NODE_ENV !== 'production',
    //middleware: [ReduxThunk, stringMiddleware]
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(stringMiddleware),

});

export default store;