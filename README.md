# vuex-observable-actions

This is a vuex plugin that allows you to write actions with experience of redux-observerble, where you can manage side effects in rxjs paradigm.

## Installation

`npm i vuex-observable-actions`

## Usage

```js
import { createStore } from 'vuex';
import VuexObservableActions from 'vuex-observable-actions';

const epics = {
  increment: (action$, { state }) => {
    return action$.pipe(
      map(() => ({
        type: 'SET_COUNT',
        payload: state.count + 1,
      }))
    );
  },
};

const store = new createStore({
  state,
  mutations,
  ...,
  plugins: [VuexObservableActions(epics)],
});

```

## Configuration

you can add global handler to subscribe all the actions that you registered to epics, such as common behavior or putting some logs like:

```js
...

const store = new createStore({
  state,
  mutations,
  ...,
  plugins: [VuexObservableActions(epics, {
    onActionStarted: ({ type }) => {
        store.commit('SHOW_LOADING_OVERLAY')
        reportLog(`Action '${type}' get triggered`)
    },
    onActionFinished: ({ type }) => {
        store.commit('HIDE_LOADING_OVERLAY')
        reportLog(`Mutation '${type}' get triggered`)
    },
  })],
});

```
