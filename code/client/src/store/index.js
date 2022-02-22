import {createStore} from 'vuex';
// import * as Vue from 'vue';
import createPersistedState from "vuex-persistedstate";
import auth from './modules/auth';

// Load Vuex
// Vue.use(Vuex);
// Create store
export default createStore({
  modules: {
    auth
  },
  plugins: [createPersistedState()]
})

