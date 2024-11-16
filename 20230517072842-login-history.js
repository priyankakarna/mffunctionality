const { DATABASE: { options: { schema } } } = require('../../../config/ids');

module.exports = {
  up: (queryInterface, DataTypes) => queryInterface.createTable('login_history', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    public_id: {
      type: DataTypes.UUID, unique: true, allowNull: false,
    },
    user_id: { type: DataTypes.UUID, allowNull: false },
    device_id: { type: DataTypes.UUID, allowNull: true },
    login_type: { type: DataTypes.STRING, allowNull: false },
    created_at: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, { schema }).then(() => queryInterface.addIndex({ tableName: 'login_history', schema }, [ 'user_id' ])),

  down: (queryInterface) => queryInterface.dropTable({ tableName: 'login_history', schema }),
};
