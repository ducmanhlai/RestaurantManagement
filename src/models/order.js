const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('order', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_staff: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'staff',
        key: 'id'
      }
    },
    time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    table: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'table',
        key: 'id'
      }
    },
    note: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'status_order',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'order',
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
        name: "fk_staff_order_idx",
        using: "BTREE",
        fields: [
          { name: "id_staff" },
        ]
      },
      {
        name: "fk_table_order_idx",
        using: "BTREE",
        fields: [
          { name: "table" },
        ]
      },
      {
        name: "fk_status_idx",
        using: "BTREE",
        fields: [
          { name: "status" },
        ]
      },
    ]
  });
};
