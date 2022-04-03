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
