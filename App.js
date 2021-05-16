import React from 'react';
import RootNavigator from './screens/RootNavigator'
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './storage/store';
import { LogBox } from "react-native";
LogBox.ignoreLogs([""]);

export default function App () {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <RootNavigator />
            </PersistGate>
        </Provider>
    )
}
