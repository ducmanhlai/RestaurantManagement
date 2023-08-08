const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('bill', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    id_order: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'order',
        key: 'id'
      },
      unique: "fk_bill_order"
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
    pay_method: {
      type: DataTypes.ENUM('cash','online'),
      allowNull: true
    },
    discount: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    total: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'bill',
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
        name: "id_order_UNIQUE",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id_order" },
        ]
      },
      {
        name: "fk_bill_order_idx",
        using: "BTREE",
        fields: [
          { name: "id_order" },
        ]
      },
      {
        name: "fk_bill_staff_idx",
        using: "BTREE",
        fields: [
          { name: "id_staff" },
        ]
      },
    ]
  });
};
