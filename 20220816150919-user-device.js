const { DATABASE: { options: { schema } } } = require('../../../config/ids');

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('user_device', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    user_id: { type: Sequelize.UUID, unique: true },
    device_id: {
      type: Sequelize.INTEGER,
      references: {
        model: {
          tableName: 'device',
          schema,
        },
        key: 'id',
      },
      allowNull: false,
      name: 'user_device_id_foreign_idx',
    },
    created_at: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
    updated_at: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW,
    },
  }, { schema }).then(() => queryInterface.addIndex({ tableName: 'user_device', schema }, [ 'device_id' ])),

  down: (queryInterface) => queryInterface.dropTable({ tableName: 'user_device', schema }),
};
