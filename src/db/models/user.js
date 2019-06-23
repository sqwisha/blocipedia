'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: {msg: 'must be valid email'}
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {});
  User.associate = function(models) {
    User.hasMany(models.Wiki, {
      foreignKey: 'userId',
      as: 'wikis'
    });
    User.hasMany(models.Collaborator, {
      foreignKey: 'userId',
      as: 'collaborations'
    })
  };
  User.prototype.isAdmin = function() {
    return this.role === 2;
  };
  User.prototype.isPremium = function() {
    return this.role === 1;
  }
  return User;
};
