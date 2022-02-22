<template>
  <div>
    <div class="container">
      <router-link to="/" id="logOut" style="text-align: center"></router-link>
    </div>
    <h1>Progression admin</h1>
    <div class="container" id="option_admin_div">
      <!-- Ajout d'un utilisateur dans MongoDB -->
      <div id="add_user_div">
        <input
          v-model="this.usernameToAdd"
          style="margin-top: 20px"
          class="form-control"
          type="text"
          placeholder="Nom d'utilisateur"
        />
        <button  @click="pushOneInMongoList(this.usernameToAdd)">
          Ajouter l'utilisateur
        </button>
      </div>
      <!-- Choix de la liste (Slam ou classe entière) -->
      <div class="container" id="select_groupe_div">
        <select name="ldap" v-model="ldap_option">
          <option style="text-align: center" value="-slam">Slam</option>
          <option style="text-align: center" value>Classe entière</option>
        </select>
        <button  @click="synchroldap()">Synchronisation</button>
        <p>{{ synchroLdapData.status }}</p>
      </div>
      <div v-if="UptoDate" class="container" id="status_synchro_div">
        <button  @click="showList()" style="margin: 15px">
          Voir les listes
        </button>
      </div>
      <div class="container_tab" v-if="notUpToDate">
        <div class="container" style="margin-top: 15px">
          <!-- Tableau avec les utilisateurs provenants de ldap -->
          <button
            
            v-if="ldapbtn"
            @click="pushAllInMongoList()"
            style="margin: 0px"
          >
            Tout récupérer
          </button>
          <table>
            <thead>
              <tr>
                <th colspan="2">Liste Ldap</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="v in InLdapNotInMongo" :key="v">
                <td>{{ v }}</td>
                <td v-if="ldapbtn">
                  <button
                    @click="pushOneInMongoList(v)"
                    id="add_to_array_right"
                    style="margin: 0px"
                  ></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="container" style="margin-top: 15px">
          <!-- Tableau avec les utilisateurs provenants de Mongodb -->
          <button  @click="deleteAllUser()" style="margin: 0px">
            Tout supprimer
          </button>
          <table>
            <thead>
              <tr>
                <th colspan="2">Liste base de données</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="v in synchroLdapData.mongoList" :key="v.username">
                <td :id="v.username">{{ v.username }}</td>
                <td>
                  <button
                    @click="deleteUser(v._id)"
                    id="delete_btn"
                    style="margin: 0px"
                  ></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import set from '../assets/fetch_set'
export default {
  methods: {
    // bouton pour voir  la liste même quand elle est synchronisé avec celle de ldap
    showList() {
      this.InLdapNotInMongo = [];
      this.synchroLdapData.Ldaplist.forEach((user) => {
        this.InLdapNotInMongo.push(user.username);
      });
      setTimeout(
        function () {
          this.notUpToDate = true;
          this.ldapbtn = false;
          this.UptoDate = false;
        }.bind(this),
        150
      );
    },
    // supprimer tous les utilisateurs de Mongodb
    deleteAllUser() {
      const requestOpt = { method: "GET", redirect: "follow" };
      fetch("http://"+this.url+":3000/evaluation/deleteAllUser", requestOpt)
        .then((response) => response.text())
        .then((result) => {
          this.users = JSON.parse(result);
        })
        .catch((error) => {
          console.log("error", error);
        });
      this.synchroldap();
    },
    deleteUser(id) {
      const requestOpt = {
        method: "POST",
        body: JSON.stringify({
          id: id,
        }),
        headers: { "Content-type": "application/json; charset=UTF-8" },
      };
      fetch("http://"+this.url+":3000/evaluation/deleteUser", requestOpt)
        .then((response) => response.text())
        .catch((error) => {
          console.log("error", error);
        });
      this.synchroldap();
    },
    // Ajouter tous les élèves qui sont dans la liste ldap mais pas dans la liste mongodb
    pushAllInMongoList() {
      const requestOpt = {
        method: "POST",
        body: JSON.stringify({
          Ldaplist: this.InLdapNotInMongo,
        }),
        headers: { "Content-type": "application/json; charset=UTF-8" },
      };
      fetch("http://"+this.url+":3000/evaluation/addAllUsers", requestOpt)
        .then((response) => response.text())
        .catch((error) => {
          console.log("error", error);
        });
      this.synchroldap();
    },
    // Ajouter un seul utilisateur qui est dans ldap mais pas dans mongodb
    pushOneInMongoList(username) {
      if (username) {
        const requestOpt = {
          method: "POST",
          body: JSON.stringify({
            username: username,
          }),
          headers: { "Content-type": "application/json; charset=UTF-8" },
        };
        fetch("http://"+this.url+":3000/evaluation/addOneUser", requestOpt)
          .then((response) => response.text())
          .catch((error) => {
            console.log("error", error);
          });
        this.synchroldap();
      } else {
        alert("rentrez un nom d'utilisateur");
      }
    },
    // Fonciton de la synchronisation avec ldap
    synchroldap() {
      // réinitialisation des variables utilisées
      this.usernameToAdd = "";
      (this.synchroLdapData = {}),
        (this.InLdapNotInMongo = []),
        (this.ListLdap = []),
        (this.ListMongo = []);

      const requestOpt = {
        method: "POST",
        body: JSON.stringify({
          groupe: this.ldap_option,
        }),
        headers: { "Content-type": "application/json; charset=UTF-8" },
      };
      fetch("http://"+this.url+":3000/evaluation/synchroLdap", requestOpt)
        .then((response) => response.text())
        .then((result) => {
          this.synchroLdapData = JSON.parse(result);
          if (this.synchroLdapData.status == "La liste n'est pas à jour") {
            this.notUpToDate = true;
            this.ldapbtn = true;
            // on met sous forme de list les noms d'utilisateur
            this.synchroLdapData.Ldaplist.forEach((user) => {
              this.ListLdap.push(user.username);
            });
            this.synchroLdapData.mongoList.forEach((user) => {
              this.ListMongo.push(user.username);
            });
            //Pour chaque nom dans la liste de ldap on verifie si il est dans la liste mongodb.
            //si il n'y est pas on l'ajoute dans une liste regroupant les utlisateur qui sont dans ldap mais pas dans mongodb.
            this.ListLdap.forEach((username) => {
              if (this.ListMongo.includes(username) == false) {
                this.InLdapNotInMongo.push(username);
              }
            });
            // Pareil pour la liste de mongodb mais là on vient changer la couleur de la case en rouge pour indiquer qu'il n'est pas dans ldap
            this.ListMongo.forEach((username) => {
              if (this.ListLdap.includes(username) == false) {
                setTimeout(
                  function () {
                    document.getElementById(username).style.backgroundColor =
                      "red";
                  }.bind(this),
                  150
                );
              }
            });
          } else if (this.synchroLdapData.status == "La liste est à jour") {
            this.notUpToDate = false;
            this.UptoDate = true;
          }
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
  },
  data() {
    return {
      url:set.url,
      title_test: "admin",
      usernameToAdd: "",
      ldap_option: "-slam",
      class: "",
      InLdapNotInMongo: [],
      ListLdap: [],
      ListMongo: [],
      synchroLdapData: {
        status: "",
      },
      UptoDate: false,
      ldapbtn: false,
      notUpToDate: false,
    };
  },
  created() {
    if (
      !this.$store.getters.UserData ||
      this.$store.getters.UserData.type != "admin"
    ) {
      alert("Vous n'avez pas les droit d'administrateur");
      this.$router.push("/");
    }
  },
};
</script>
