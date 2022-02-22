var passport = require("passport");
require("../../config/passport")(passport);
const db = require("../models");
const User = db.users;
// ================================================Portail d'authentification pour admin prof..==========================================
exports.login = (req, res) => {
  User.findOne(
    {
      username: req.body.username,
    },
    function (err, user) {
      if (err) throw err;

      if (!user) {
        res.status(401).send({
          success: false,
          msg: "Authentication failed. User not found.",
        });
      } else {
        // check if password matches
        user.comparePassword(req.body.password, function (err, isMatch) {
          if (isMatch && !err) {
            user.password = null;
            res.send(user);
          } else {
            res.status(401).send({
              success: false,
              msg: "Authentication failed. Wrong password.",
            });
          }
        });
      }
    }
  );
};

// =========================Ajout d'un utilisateur type prof ou admin==========================================
exports.register = (req, res) => {
  if (!req.body.username) {
    res.json({ success: false, msg: "Please pass username and password." });
  } else {
    var newUser = new User({
      username: req.body.username,
      password: req.body.password,
      type: req.body.type,
    });
    // save the user
    newUser.save(function (err) {
      if (err) {
        return res.json({ success: false, msg: "Username already exists." });
      }
      res.json({ success: true, msg: "Successful created new user." });
    });
  }
};
// ====================================Ajouter la liste provenant de ldap======================================
exports.addAllUsers = (req, res) => {
  var userstoAdd = [];
  req.body.Ldaplist.forEach((user) => {
    userstoAdd.push({ username: user, type: "user" });
  });
  User.insertMany(userstoAdd, (error, res) => {
    if (error) throw error;
    console.log("Utilisateurs ajoutés!");
  });
};
// ============================================Ajouter un seul utilisateur (type user)
// On utilise insertMany même pour un seul utilisateur car sinon il aura un mot de passe par défaut
exports.addOneUser = (req, res) => {
  var usertoAdd = { username: req.body.username, type: "user" };
  User.insertMany(usertoAdd, (error, res) => {
    if (error) throw error;
    console.log("Utilisateur ajouté!");
  });
};
// ==============================Fin portail d'authentification pour admin prof..================================

//====================================Liste des utilisateur pour la partie prof=========================================
exports.getUsersList = (req, res) => {
  User.find({ type: "user" }, "username")
    .then((data) => {
      mongoUserList = data;
      res.send(mongoUserList);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message ||
          "Il y un problème avec la reception des questioannaires.",
      });
    });
};

// ===============================suppression de tous les utilisateurs de la bdd==================================== 
exports.deleteAllUser = (req, res) => {
  User.deleteMany({ type: "user" })
    .then((data) => {
      res.send({
        message: `${data.deletedCount} Tutorials were deleted successfully!`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all tutorials.",
      });
    });
};
// ==========================================suppression d'un utilisateur=============================================
exports.deleteUser = (req, res) => {
  const id = req.body.id;
  User.findByIdAndRemove(id).catch((err) => {
    res.status(500).send({
      message: "Could not delete user with id=" + id,
    });
  });
};

// ============================Synchronisation de la base de données avec la liste de ldap=============================
exports.synchroLdap = (req, res) => {
  User.find({ type: "user" }, "username")
    .then((data) => {
      //On recupère la liste de la base de donnée
      mongoUserList = data;
      // Puis la liste de ldap
      var export_test = require("../ldap/ldap.js");
      var users = export_test.getLdapList(req.body.groupe);
      setTimeout(() => {
        var LdapUserList = [];
        users.forEach((user) => {
          LdapUserList.push({ username: user });
        });
        // Puis on les compare et verifie si les liste sont exactement les même ou pas
        var nb_inside = 0;
        LdapUserList.forEach((usernameLdap) => {
          mongoUserList.forEach((usernameMongo) => {
            if (usernameLdap.username == usernameMongo.username) {
              nb_inside++;
            }
          });
        });
        if (
          nb_inside === LdapUserList.length &&
          mongoUserList.length == nb_inside
        ) {
          res.send({
            status: "La liste est à jour",
            Ldaplist: LdapUserList,
            mongoList: mongoUserList,
          });
        } else {
          res.send({
            status: "La liste n'est pas à jour",
            Ldaplist: LdapUserList,
            mongoList: mongoUserList,
          });
        }
      }, 500);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Il y un problème avec la reception des listes.",
      });
    });
};
