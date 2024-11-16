const { ALGORITHM } = require('../../../utils/constant');
const { DATABASE: { options: { schema } } } = require('../../../config/ids');

module.exports = {
  up: (queryInterface, DataTypes) => queryInterface.createTable('client', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    public_id: {
      type: DataTypes.UUID,
      unique: true,
      allowNull: false,
    },
    user_id: { type: DataTypes.UUID, allowNull: false },
    key_id: { type: DataTypes.UUID, unique: true, allowNull: false },
    private_key: { type: DataTypes.BLOB, allowNull: false },
    public_key: { type: DataTypes.BLOB, allowNull: false },
    issuer: { type: DataTypes.STRING, allowNull: false },
    subject: { type: DataTypes.STRING, allowNull: false },
    audience: { type: DataTypes.STRING, allowNull: false },
    expires_in: { type: DataTypes.STRING, allowNull: false },
    refresh_expires_in: { type: DataTypes.STRING, allowNull: false },
    algorithm: { type: DataTypes.STRING, allowNull: false, defaultValue: ALGORITHM.RS256 },
    secret: { type: DataTypes.STRING, allowNull: false },
    salt: { type: DataTypes.STRING, allowNull: false },
    created_by: { type: DataTypes.UUID, allowNull: false },
    updated_by: { type: DataTypes.UUID, allowNull: false },
    is_deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    tags: { type: DataTypes.ARRAY(DataTypes.JSONB), allowNull: false },
    passphrase: { type: DataTypes.STRING },
    last_used_at: { type: DataTypes.DATE, allowNull: true, defaultValue: DataTypes.NOW },
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
  }, { schema }).then(() => queryInterface.addIndex({ tableName: 'client', schema }, [ 'user_id' ]))
    .then(() => queryInterface.addIndex({ tableName: 'client', schema }, [ 'issuer' ]))
    .then(() => queryInterface.addIndex({ tableName: 'client', schema }, [ 'subject' ]))
    .then(() => queryInterface.addIndex({ tableName: 'client', schema }, [ 'audience' ]))
    .then(() => queryInterface.addIndex({ tableName: 'client', schema }, [ 'is_deleted' ])),

  down: (queryInterface) => queryInterface.dropTable({ tableName: 'client', schema }),
};
