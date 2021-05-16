import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistStore, persistReducer } from 'redux-persist';

import booksReducer from './reducers';

const persistConfig = {
    key: 'auth',
    storage: AsyncStorage,
};

const rootReducer = combineReducers({
    booksReducer: persistReducer(persistConfig, booksReducer)
});

export const store = createStore(rootReducer, applyMiddleware(thunk));
export const persistor = persistStore(store);
