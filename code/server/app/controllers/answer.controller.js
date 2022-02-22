const db = require("../models");
const Answer = db.answers;

// =====================================Sauvegarde de la progression ====================================
exports.saveAnswer = (req, res) => {
    var isset = [""];
    Answer.find({'id_user' : req.body.id_user, 'id_project' : req.body.id_project})
        .then(data => {
            try_answer = data;
            isset = JSON.stringify(try_answer)
            isset = JSON.parse(isset)
            if(isset == ''){
                //si la réponse n'existe pas on la crée
                if (!req.body.progress) {
                    res.status(400).send({ message: "Le contenu ne peux pas être vide" });
                return;
                }else{
                    const ans = new Answer({
                        id_user: req.body.id_user,
                        id_project: req.body.id_project,
                        progress: req.body.progress
                    });
                    ans
                        .save(ans)
                        .then(data => {
                            res.send(data);
                        })
                        .catch(err => {
                            res.status(500).send({
                                message: err.message || "Erreur | Impossible de créer l'objet Answer"
                            });
                    });
                }
            }else{
                //Si la réponse existe on la modifie avec les nouveaux paramètres
                let changes = {
                    progress:req.body.progress
                }
                id_answer = try_answer[0]._id
                Answer.findByIdAndUpdate(id_answer, changes, { useFindAndModify: false })
                .catch(err => {
                    res.status(500).send({
                        message: "Error updating Matiere with id: " + id
                    });
                });
                res.send('L\'objet a bien été modifié')
            }
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Il y un problème avec la reception de la progression."
            });
        });  
};