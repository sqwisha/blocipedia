'use strict';
module.exports = (sequelize, DataTypes) => {
  var Wiki = sequelize.define('Wiki', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    private: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {});
  Wiki.associate = function(models) {
    Wiki.belongsTo(models.User, {
      foreignKey: 'userId',
      onDelete: 'CASCADE'
    });
    Wiki.hasMany(models.Collaborator, {
      foreignKey: 'wikiId',
      as: 'collaborators'
    });
    Wiki.afterCreate((wiki, callback) => {
      return models.Collaborator.create({
        wikiId: wiki.id,
        userId: wiki.userId
      });
    });
  };
  return Wiki;
};
