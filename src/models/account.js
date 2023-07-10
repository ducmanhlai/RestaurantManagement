const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('account', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    user_name: {
      type: DataTypes.STRING(45),
      allowNull: false,
      unique: "user_name_UNIQUE"
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    role: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'role',
        key: 'id'
      }
    },
    lock: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'account',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "user_name_UNIQUE",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "user_name" },
        ]
      },
      {
        name: "fk_role_idx",
        using: "BTREE",
        fields: [
          { name: "role" },
        ]
      },
    ]
  });
};
