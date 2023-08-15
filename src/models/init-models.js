var DataTypes = require("sequelize").DataTypes;
var _account = require("./account");
var _activity_login = require("./activity_login");
var _bill = require("./bill");
var _food = require("./food");
var _order = require("./order");
var _order_detail = require("./order_detail");
var _role = require("./role");
var _staff = require("./staff");
var _status_order = require("./status_order");
var _status_order_detail = require("./status_order_detail");
var _table = require("./table");
var _type_dish = require("./type_dish");

function initModels(sequelize) {
  var account = _account(sequelize, DataTypes);
  var activity_login = _activity_login(sequelize, DataTypes);
  var bill = _bill(sequelize, DataTypes);
  var food = _food(sequelize, DataTypes);
  var order = _order(sequelize, DataTypes);
  var order_detail = _order_detail(sequelize, DataTypes);
  var role = _role(sequelize, DataTypes);
  var staff = _staff(sequelize, DataTypes);
  var status_order = _status_order(sequelize, DataTypes);
  var status_order_detail = _status_order_detail(sequelize, DataTypes);
  var table = _table(sequelize, DataTypes);
  var type_dish = _type_dish(sequelize, DataTypes);

  activity_login.belongsTo(account, { as: "id_account_account", foreignKey: "id_account"});
  account.hasMany(activity_login, { as: "activity_logins", foreignKey: "id_account"});
  staff.belongsTo(account, { as: "id_account_account", foreignKey: "id_account"});
  account.hasMany(staff, { as: "staffs", foreignKey: "id_account"});
  order_detail.belongsTo(food, { as: "id_dish_food", foreignKey: "id_dish"});
  food.hasMany(order_detail, { as: "order_details", foreignKey: "id_dish"});
  bill.belongsTo(order, { as: "id_order_order", foreignKey: "id_order"});
  order.hasOne(bill, { as: "bill", foreignKey: "id_order"});
  order_detail.belongsTo(order, { as: "id_order_order", foreignKey: "id_order"});
  order.hasMany(order_detail, { as: "order_details", foreignKey: "id_order"});
  account.belongsTo(role, { as: "role_role", foreignKey: "role"});
  role.hasMany(account, { as: "accounts", foreignKey: "role"});
  bill.belongsTo(staff, { as: "id_staff_staff", foreignKey: "id_staff"});
  staff.hasMany(bill, { as: "bills", foreignKey: "id_staff"});
  order.belongsTo(staff, { as: "id_staff_staff", foreignKey: "id_staff"});
  staff.hasMany(order, { as: "orders", foreignKey: "id_staff"});
  order.belongsTo(status_order, { as: "status_status_order", foreignKey: "status"});
  status_order.hasMany(order, { as: "orders", foreignKey: "status"});
  order_detail.belongsTo(status_order_detail, { as: "status_status_order_detail", foreignKey: "status"});
  status_order_detail.hasMany(order_detail, { as: "order_details", foreignKey: "status"});
  order.belongsTo(table, { as: "table_table", foreignKey: "table"});
  table.hasMany(order, { as: "orders", foreignKey: "table"});
  food.belongsTo(type_dish, { as: "type_type_dish", foreignKey: "type"});
  type_dish.hasMany(food, { as: "foods", foreignKey: "type"});

  return {
    account,
    activity_login,
    bill,
    food,
    order,
    order_detail,
    role,
    staff,
    status_order,
    status_order_detail,
    table,
    type_dish,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
