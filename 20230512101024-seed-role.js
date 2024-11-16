const role = require('../../seed/role');
const { DATABASE: { options: { schema } } } = require('../../../config/ids');

module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert({ tableName: 'role', schema }, role, {}),
  down: (queryInterface) => queryInterface.truncate({ tableName: 'role', schema }, {}),
};
