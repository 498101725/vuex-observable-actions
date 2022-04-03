// Imports dependencies.
import { createApp } from 'vue/dist/vue.esm-bundler';
import { mapActions, mapState } from 'vuex';
import store from './store';

// Sets up Vue.
const app = createApp({
  computed: mapState(['count']),
  template: `
    <div><label>{{ count }}</label> <button @click="increment">+</button></div>
  `,
  methods: mapActions(['increment']),
});

app.use(store);

app.mount('#app');
