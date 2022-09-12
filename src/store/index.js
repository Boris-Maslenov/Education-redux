import { createStore, combineReducers } from 'redux';
import {heroes, filters} from '../reducers';

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
const store = createStore(rootReducer, enhancer);

export default store;

//window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()