const { DATABASE: { options: { schema } } } = require('../../../config/ids');

module.exports = {
  up: (queryInterface, DataType) => queryInterface.createTable('otp', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataType.INTEGER,
    },
    public_id: { type: DataType.UUID, unique: true, allowNull: false },
    type: { type: DataType.STRING, allowNull: false },
    mobile_number: { type: DataType.STRING, allowNull: false },
    otp: { type: DataType.STRING, allowNull: false },
    validity: { type: DataType.DATE, allowNull: false },
    created_at: {
      allowNull: false,
      type: DataType.DATE,
      defaultValue: DataType.NOW,
    },
    updated_at: {
      allowNull: false,
      type: DataType.DATE,
      defaultValue: DataType.NOW,
    },
  }, { schema }).then(() => queryInterface.addIndex({ tableName: 'otp', schema }, [ 'mobile_number' ]))
    .then(() => queryInterface.addIndex({ tableName: 'otp', schema }, [ 'type' ])),

  down: (queryInterface) => queryInterface.dropTable({ tableName: 'otp', schema }),
};
