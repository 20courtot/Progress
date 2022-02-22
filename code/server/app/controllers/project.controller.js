const db = require("../models");
const Project = db.projects;
const Answer = db.answers;
// ================================Récupérationd de la list des projets créés=======================================
exports.getProjectsList = (req, res) => {
    var projectsList = {}
    Project.find()
    .then(data => {
        projectsList = data;
        res.send(projectsList)
    })
    .catch(err => {
        res.status(500).send({
            message: err.message || "Il y un problème avec la reception des questioannaires."
        });
    });  
}
// ================Récupération de la progression pour un certain projet et un certain utilisateur===================
exports.getProjectsData = (req, res) => {
    Answer.find({'id_user':req.body.id_user,'id_project':req.body.id_project})
    .then(data => {
        try_projectData = data;
        isset = JSON.stringify(try_projectData)
        isset = JSON.parse(isset)
        if(isset == ''){
            //si la réponse n'existe pas on la crée
            Project.find({'_id':req.body.id_project})
            .then(data => {
                res.send(data[0].stages)
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message || "Il y un problème avec la reception des projets."
                });
            });     
        }else{
            //Si la réponse existe on la modifie avec les nouveaux paramètres
            res.send(data[0].progress)
        }
    })
    .catch(err => {
        res.status(500).send({
            message: err.message || "Il y un problème avec la reception des projets."
        });
    });  
}
// =======================création de projets avec les différentes taches=======================
exports.create_project = (req, res) => {
    if (!req.body.name) {
        res.status(400).send({ message: "Le contenu ne peux pas être vide" });
    return;
    }
    const project = new Project({
        name: req.body.name,
        stages: req.body.stages,
    });
    project
        .save(project)
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Erreur | Impossible de créer l'objet Project"
            });
    });
};

