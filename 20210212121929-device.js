const { DEVICE_STATUS, PLATFORM } = require('../../../utils/constant');
const { DATABASE: { options: { schema } } } = require('../../../config/ids');

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('device', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    public_id: { type: Sequelize.UUID, unique: true },
    device_id: { type: Sequelize.STRING, unique: true },
    version_code: { type: Sequelize.STRING, allowNull: false },
    platform: { type: Sequelize.STRING, defaultValue: PLATFORM.AN },
    status: { type: Sequelize.STRING, defaultValue: DEVICE_STATUS.ACTIVE },
    registration_token: { type: Sequelize.STRING },
    mcc_mnc: { type: Sequelize.STRING },
    operator: { type: Sequelize.STRING },
    is_deleted: { type: Sequelize.BOOLEAN, defaultValue: false },
    utm_source: { type: Sequelize.STRING },
    utm_medium: { type: Sequelize.STRING },
    utm_campaign: { type: Sequelize.STRING },
    build_number: { type: Sequelize.STRING },
    brand: { type: Sequelize.STRING },
    build_name: { type: Sequelize.STRING },
    manufacturer: { type: Sequelize.STRING },
    model: { type: Sequelize.STRING },
    os_version: { type: Sequelize.STRING },
    referrer: { type: Sequelize.STRING },
    screen_dpi: { type: Sequelize.STRING },
    screen_height: { type: Sequelize.STRING },
    screen_width: { type: Sequelize.STRING },
    wifi: { type: Sequelize.STRING },
    radio: { type: Sequelize.STRING },
    os: { type: Sequelize.STRING },
    mcc: { type: Sequelize.STRING },
    mnc: { type: Sequelize.STRING },
    network: { type: Sequelize.STRING },
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
  }, { schema }).then(() => queryInterface.addIndex({ tableName: 'device', schema }, [ 'registration_token' ])),

  down: (queryInterface) => queryInterface.dropTable({ tableName: 'device', schema }),
};
