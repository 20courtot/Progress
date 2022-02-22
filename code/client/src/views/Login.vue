<template>
  <div id="Login">
    <div class="login_continer" style="padding-top: 50px">
      <div>
        <h1 style="margin-bottom: 10px">Success</h1>
        <br />
        <br />
        <h2>Portail de connexion</h2>
        <br />
        <br />
        <form @submit.prevent="submit">
          <div class="form-div" style="padding-bottom: 12px">
            <label style="font-weight: bold">Nom d'utilisateur:</label>
            <br />
            <input
              v-model="form.username"
              style="margin-top: 20px"
              class="form-control"
              type="text"
              placeholder="Nom d'utilisateur"
            />
          </div>
          <div class="form-div" style="margin-bottom: 30px">
            <label style="font-weight: bold; margin-top: 20px"
              >Mot de passe:</label
            >
            <br />
            <input
              v-model="form.password"
              style="margin-top: 20px"
              class="form-control"
              type="password"
              placeholder="Mot de passe"
            />
          </div>
          <div style="margin-bottom: 10px" class="form-div">
            <button  type="submit" style="margin-left: 0px">Se connecter</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions } from "vuex";
export default {
  name: "Login",
  data: function () {
    return {
      form: {},
    };
  },
  computed: {
    isLoggedIn: function () {
      return this.$store.getters.isAuthenticated;
    },
  },
  methods: {
    ...mapActions(["LogIn"]),
    ...mapActions(["LogOut"]),
    async submit() {
      try {
        await this.LogIn(this.form);

        switch (this.$store.getters.UserData.type) {
          case "admin":
            this.$router.push("/admin");
            break;
          case "prof":
            this.$router.push("/progress");
            break;
        }
      } catch (error) {
        alert("Nom d'utilisateur invalide");
      }
    },
  },
  created() {
    this.LogOut();
    if (this.$store.getters.UserData) {
      console.log(this.$store.getters.UserData.type);
    }
  },
};
</script>
