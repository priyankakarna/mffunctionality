const { USER_STATUS } = require('../../../utils/constant');
const { DATABASE: { options: { schema } } } = require('../../../config/ids');

module.exports = {
  up: (queryInterface, DataTypes) => queryInterface.createTable('user', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    public_id: { type: DataTypes.UUID, unique: true, allowNull: false },
    user_name: { type: DataTypes.STRING, unique: true },
    user_type: { type: DataTypes.STRING, allowNull: false },
    mobile_number: { type: DataTypes.STRING },
    is_mobile_verified: { type: DataTypes.BOOLEAN, defaultValue: false },
    email: { type: DataTypes.STRING },
    is_email_verified: { type: DataTypes.BOOLEAN, defaultValue: false },
    hashed_password: { type: DataTypes.STRING },
    system_generated_password: { type: DataTypes.BOOLEAN, defaultValue: true },
    salt: { type: DataTypes.STRING },
    role_id: { type: DataTypes.UUID, allowNull: false },
    status: { type: DataTypes.STRING, defaultValue: USER_STATUS.ACTIVE },
    password_validity: { type: DataTypes.DATE },
    name: { type: DataTypes.STRING },
    profile_pic_url: { type: DataTypes.STRING },
    google_id: { type: DataTypes.STRING, unique: true },
    google: { type: DataTypes.JSONB },
    linkdin_id: { type: DataTypes.STRING, unique: true },
    linkdin: { type: DataTypes.JSONB },
    apple_id: { type: DataTypes.STRING, unique: true },
    apple: { type: DataTypes.JSONB },
    last_login_at: { type: DataTypes.DATE },
    distinct_id: { type: DataTypes.UUID, unique: true, allowNull: false },
    concurrency_stamp: { type: DataTypes.UUID, unique: true, allowNull: false },
    is_mfa_enabled: { type: DataTypes.BOOLEAN, defaultValue: false },
    mfa_secret: { type: DataTypes.STRING },

    created_by: { type: DataTypes.UUID },
    updated_by: { type: DataTypes.UUID },
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
  }, { schema }).then(() => queryInterface.addIndex({ tableName: 'user', schema }, [ 'mobile_number' ]))
    .then(() => queryInterface.addIndex({ tableName: 'user', schema }, [ 'email' ]))
    .then(() => queryInterface.addIndex({ tableName: 'user', schema }, [ 'email', 'user_type' ], {
      name: 'email_user_type_user_unique',
      unique: true,
    }))
    .then(() => queryInterface.addIndex({ tableName: 'user', schema }, [ 'mobile_number', 'user_type' ], {
      name: 'mobile_number_user_type_user_unique',
      unique: true,
    })),

  down: (queryInterface) => queryInterface.dropTable({ tableName: 'user', schema }),
};
