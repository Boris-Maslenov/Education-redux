import { createStore, combineReducers, compose, applyMiddleware} from 'redux';
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

const enhancer = (createStore) => (...args) => {
    const store = createStore(...args);
    const oldDispatch = store.dispatch;
    store.dispatch = (action) => {
        if(typeof action === 'string') {
            return oldDispatch({
                type: action
            })
        }
        return oldDispatch(action);
    }
    return store;
}

const rootReducer = combineReducers({heroes, filters});
const store = createStore(
                    rootReducer, 
                    applyMiddleware(stringMiddleware)
                    //compose(enhancer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
                    );

export default store;

//window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()