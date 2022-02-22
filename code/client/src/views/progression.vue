<template>
  <div class="container">
    <router-link to="/" id="logOut" style="text-align: center"></router-link>
  </div>
  <h1>Progression</h1>
  <div class="container">
    <button  @click="add_projects()">Ajouter des projets</button>
    <div class="list_container">
      <!-- ==============================Liste des étudiants==================================== -->
      <select v-bind="users.username" v-model="id_user">
        <option value>Liste des étudiants</option>
        <option
          v-for="v in users"
          v-bind:key="v.username"
          v-text="v.username"
          :value="v.username"
        ></option>
      </select>
      <!-- ==============================Liste des projets==================================== -->
      <select v-bind="projects.name" v-model="id_project">
        <option value>Liste des projets</option>
        <option
          v-for="v in projects"
          v-bind:key="v.name"
          v-text="v.name"
          :value="v._id"
        ></option>
      </select>
      <br />
      <div style="margin: 15px">
        <input type="checkbox" id="check_valid" v-model="check" />
        <label for="check_valid">Masquer les compétences validées</label>
      </div>
      <button  @click="get_projects_data()">rechercher</button>
    </div>
    <!-- ================================Card d'évaluation de chaque tâche============================ -->
    <div v-if="card">
      <div
        class="card_container"
        v-for="v in projects_data"
        v-bind:key="v.stage_label"
        :id="v.stage_label + '-div'"
      >
        <div>
          <h2>{{ v.stage_label }}</h2>
        </div>
        <div>
          <div class="wrapper">
            <input
              type="radio"
              v-model="v.rate"
              :id="v.stage_label + '-1'"
              :name="v.stage_label"
              :value="parseInt(3)"
            />
            <label class="star_label" :for="v.stage_label + '-1'"></label>
            <input
              type="radio"
              v-model="v.rate"
              :id="v.stage_label + '-2'"
              :name="v.stage_label"
              :value="parseInt(2)"
            />
            <label class="star_label" :for="v.stage_label + '-2'"></label>
            <input
              type="radio"
              v-model="v.rate"
              :id="v.stage_label + '-3'"
              :name="v.stage_label"
              :value="parseInt(1)"
            />
            <label class="star_label" :for="v.stage_label + '-3'"></label>
            <input
              type="radio"
              v-model="v.rate"
              :id="v.stage_label + '-uncheck'"
              :name="v.stage_label"
              :value="parseInt(0)"
            />
            <label
              class="uncheck_label"
              :for="v.stage_label + '-uncheck'"
            ></label>
          </div>
        </div>
        <div>
          <textarea
            rows="5"
            cols="33"
            v-model="v.comment"
            placeholder="Commentaires .."
          ></textarea>
        </div>
      </div>
      <div class="container" style="margin-top: 15px">
        <button  @click="save_answer()">Sauvegarder</button>
        <p v-if="saved_confirmation" style="color:green;">Sauvegardé ! </p>
      </div>
    </div>
  </div>
</template>
<script>
import set from '../assets/fetch_set'
export default {
  methods: {
    // Aller à la page d'ajout des projets
    add_projects() {
      this.$router.push("/add_projects");
    },
    // requète ajout de projet
    get_projects() {
      const requestOpt = { method: "GET", redirect: "follow" };
      fetch("http://"+this.url+":3000/evaluation/getProjectsList", requestOpt)
        .then((response) => response.text())
        .then((result) => {
          this.projects = JSON.parse(result);
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
    // requète pour récupérer les taches d'un projet et d'un etudiant
    get_projects_data() {
      this.save_answer()
    // Tester de save avant de rechercher avec this.progress[0].stage_label
      if (this.id_project && this.id_user) {
          const requestOpt = {
            method: "POST",
            body: JSON.stringify({
              id_user: this.id_user,
              id_project: this.id_project,
            }),
            headers: { "Content-type": "application/json; charset=UTF-8" },
          };
          fetch("http://"+this.url+":3000/evaluation/getProjectsData", requestOpt)
            .then((response) => response.text())
            .then((result) => {
              this.passed_user = this.id_user
              this.passed_project = this.id_project
              this.card = true;
              this.saved = false;
              this.projects_data =JSON.parse(result);
              setTimeout(
                function () {
                  for (let i = 0; i < this.projects_data.length; i++) {
                    if (this.projects_data[i].rate == 1) {
                      document.getElementById(
                        this.projects_data[i].stage_label + "-3"
                      ).checked = true;
                    } else if (this.projects_data[i].rate == 2) {
                      document.getElementById(
                        this.projects_data[i].stage_label + "-2"
                      ).checked = true;
                    } else if (this.projects_data[i].rate == 3) {
                      document.getElementById(
                        this.projects_data[i].stage_label + "-1"
                      ).checked = true;
                    }
                    if (this.check == true && this.projects_data[i].rate == 3) {
                      document.getElementById(
                        this.projects_data[i].stage_label + "-div"
                      ).style.display = "none";
                    } else {
                      document.getElementById(
                        this.projects_data[i].stage_label + "-div"
                      ).style.display = "block";
                    }
                  }
                }.bind(this),
                250
              );
            })
            .catch((error) => {
              console.log("error", error);
            });
      } else {
        alert("Vous devez selectionner un projet et un utilisateur !");
      }
    },
    // requète récupérer la liste des utilisateurs
    get_users() {
      const requestOpt = { method: "GET", redirect: "follow" };
      fetch("http://"+this.url+":3000/evaluation/getUsersList", requestOpt)
        .then((response) => response.text())
        .then((result) => {
          this.users = JSON.parse(result);
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
    // sauvegarde de la progression d'un étudiant pour un projet donné
    save_answer() {
      const requestOpt = {
        method: "POST",
        body: JSON.stringify({
          id_user: this.passed_user,
          id_project: this.passed_project,
          progress: this.projects_data,
        }),
        headers: { "Content-type": "application/json; charset=UTF-8" },
      };
      fetch("http://"+this.url+":3000/evaluation/saveAnswer", requestOpt)
        .then((response) => response.text())
        .then(() => {
          this.saved = true;
          this.saved_confirmation = true;
          setTimeout(() => {
            this.saved_confirmation = false;
          }, 2000);
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
  },
  data() {
    return {
      url:set.url,
      saved_confirmation:false,
      passed_user:"",
      passed_project:"",
      saved: true,
      check: false,
      card: false,
      projects_data: [
        {
          rate: 0,
          stage_label: "",
          comment: "",
        },
      ],
      id_user: "",
      id_project: "",
      users: [],
      projects: {
        name: "",
      },
    };
  },
  created() {
    // Il faut être connécté pour accéder à cette page
    if (!this.$store.getters.UserData) {
      this.$router.push({ name: "Login" });
    }
    this.get_projects();
    this.get_users();
  },
};
</script>
