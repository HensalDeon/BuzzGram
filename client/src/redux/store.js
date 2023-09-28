import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import { reducers } from '../reducers';
import env from '../../env';
function saveToLocalStorage(store) {
  try {
    const serializedStore = JSON.stringify(store.getState());
    window.localStorage.setItem('store', serializedStore);
  } catch (e) {
    console.error(e);
  }
}

function loadFromLocalStorage() {
  try {
    const serializedStore = window.localStorage.getItem('store');
    if (serializedStore === null) return undefined;
    return JSON.parse(serializedStore);
  } catch (e) {
    console.error(e);
    return undefined;
  }
}

const persistedState = loadFromLocalStorage();

const store = configureStore({
  reducer: reducers,
  preloadedState: persistedState,
  middleware: [thunk],
  devTools: env.NODE_ENV !== "production",
});

store.subscribe(() => saveToLocalStorage(store));

export default store;
