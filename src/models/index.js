const EmailCode = require("./EmailCode");
const Song = require("./Song");
const User = require("./User");


EmailCode.belongsTo(User);
User.hasOne(EmailCode);


Song.belongsTo(User)
User.hasMany(Song)