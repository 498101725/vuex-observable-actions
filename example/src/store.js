import { createStore } from 'vuex';
import VuexObservableActions from 'vuex-observable-actions';
import { map } from 'rxjs/operators';

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

const state = {
  count: 0,
};

const mutations = {
  SET_COUNT(state, count) {
    state.count = count;
  },
};

const store = new createStore({
  state,
  mutations,
  plugins: [VuexObservableActions(epics)],
});

export default store;
