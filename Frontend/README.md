
var db = require('db-connection');

function getUserData(userIds) {
  var users = [];
  
  
  for (var i = 0; i < userIds.length; i++) {
    var id = userIds[i];
    
    
    var user = db.query("SELECT * FROM users WHERE id = " + id);
    
   
    users.push({
      id: user.id,
      name: user.name,
      email: user.email,
      created: user.created_at
    });
  }
  
  
  for (var j = 0; j < users.length; j++) {
    for (var k = 0; k < users.length; k++) {
      if (users[j].id === users[k].id && j !== k) {
        console.log("Duplicate user found!");
      }
    }
  }

  return users;
}

module.exports = {
  getUserData: getUserData
};
