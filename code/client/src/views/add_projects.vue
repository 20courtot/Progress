<template>
  <h1>Progression</h1>
  <div class="container">
    <button  @click="progression()">Retour</button>
    <br>
    <div class="container">
      <p v-if="created_confirmation" style="color:green;">Projet créé !</p>
      <label>Nom du projet: </label>
      <input v-model="project_name" type="text" />
    </div>
    <div class="container">
      <button  @click="add()" id="add_button"></button>
      <div v-if="appear" style="margin:5px">
        <div v-for="v in stages" v-bind:key="v.rate" class="card_container">    
          <label>Titre de la tache: </label>
          <input v-model="v.stage_label" class="form-control" type="text" placeholder="Travail à faire" required>
        </div>
        <div class="container" style="margin-top: 20px;">
          <button  @click="create_project()">Sauvegarder</button>
        </div>      
      </div>
    </div>
  </div>
</template>
<script>
import set from '../assets/fetch_set'
export default {
  methods: {
    // boutton retour
    progression(){
      this.$router.push("/progress")
    },
    // ajout d'une div pour ajouter une tache et donc push dans le tableau
    add(){
      this.appear = true
      this.stages.push({
          stage_label: "",
          rate: 0,
        });
    },
    // Envoie du projet
    create_project(){
      if(this.project_name){
        for(let i = 0;i < this.stages.length; i++){
          if(this.stages[i].stage_label == ""){
            this.stages.splice(i, 1);
          }
        }
        const requestOpt = {
        method: "POST",
        body: JSON.stringify({
          name: this.project_name,
          stages: this.stages
        }),
        headers: { "Content-type": "application/json; charset=UTF-8" },
        };
        fetch("http://"+this.url+":3000/evaluation/create_project", requestOpt)
        .then((response) => response.text())
        .then(() =>{
          this.stages = []
          this.project_name = ""
          this.created_confirmation = true
          setTimeout(() => {
            this.created_confirmation = false
          }, 1500);
        })
        .catch((error) => {
          console.log("error", error);
        });
      }else{
        alert('Vous devez donner un nom au projet !')
      }
    },
  },
  data() {
    return {
      url:set.url,
      created_confirmation:false,
      appear:false,
      project_name:"",
      stages:[]
    };
  },
  created(){
    if (!this.$store.getters.UserData) {
      this.$router.push({ name: "Login" });
    }
  },
}
</script>