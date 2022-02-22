module.exports = (app) => {
  var router = require("express").Router();
  app.use("/evaluation", router);
  const userController = require("../controllers/user.controller.js");
  const projectController = require("../controllers/project.controller.js");
  const answerController = require("../controllers/answer.controller.js");

  router.post("/login", function (req, res, next) {
    userController.login(req, res, next);
  });
  router.post("/register", function (req, res, next) {
    userController.register(req, res, next);
  });

  router.post("/addOneUser", userController.addOneUser);

  router.post("/addAllUsers", userController.addAllUsers);

  router.get("/deleteAllUser", userController.deleteAllUser);

  router.post("/deleteUser", userController.deleteUser);

  router.get("/getUsersList", userController.getUsersList);

  router.post("/synchroLdap", userController.synchroLdap);

  router.get("/saveAnswer", answerController.saveAnswer);

  router.post("/saveAnswer", answerController.saveAnswer);

  router.get("/getProjectsList", projectController.getProjectsList);

  router.post("/getProjectsData", projectController.getProjectsData);

  router.post("/create_project", projectController.create_project);
};
