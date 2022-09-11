import { createStore, combineReducers } from 'redux';
import {heroes, filters} from '../reducers';

const rootReducer = combineReducers({heroes, filters});
const store = createStore(rootReducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

export default store;