module.exports = {
  getLdapList : function (groupe) {
    var ldap = require("ldapjs");
    var client = ldap.createClient({
      url: "ldaps://ldap.trionfini.com:636",
    });
    var opts = {
      filter:
        "(&(|(objectclass=inetOrgPerson))(|(memberof=cn=sio2020"+groupe+",cn=groups,dc=ldap,dc=trionfini,dc=com)))",
      scope: "sub",
      attributes: ["uid"],
    };
    const users_load = [];
    var users = [];
  
    client.bind("", "", function (err) {
      if (err) {
        console.log("erreur:" + err);
      } else {
        console.log("connecté à ldap");
        client.search("dc=ldap,dc=trionfini,dc=com", opts, function (err, res) {
          if (err) {
            console.log("erreur:" + err);
          } else {
            res.on("searchEntry", function (entry) {
              users_load.push(entry.object.uid);              
            });
            res.on('end', () => {
              users = users_load
            });
            res.on("error", function (err) {
              console.log("error:" + err.message);
            }); 
          }
        });
      }
    });
    return users_load
  },
  
}