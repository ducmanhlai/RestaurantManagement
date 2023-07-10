const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('staff', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_account: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'account',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING(70),
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING(13),
      allowNull: true
    },
    salary: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    create_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    avatar: {
      type: DataTypes.STRING(2048),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'staff',
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
        name: "fk_staff_account_idx",
        using: "BTREE",
        fields: [
          { name: "id_account" },
        ]
      },
    ]
  });
};
