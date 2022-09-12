import { createStore, combineReducers, compose, applyMiddleware} from 'redux';
import ReduxThunk from 'redux-thunk';
import {heroes, filters} from '../reducers';
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

const rootReducer = combineReducers({heroes, filters});
const store = createStore(
                    rootReducer, 
                    compose(applyMiddleware(ReduxThunk, stringMiddleware), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
                    );

export default store;