const UserService = require('../../services/admin/user');
const { create: createSchema, update: updateSchema } = require('../../dto-schemas/admin/user');

const Validator = require('../../utils/validator');

const create = async (req, res) => {
  try {
    const { body, auth: { userId, role } } = req;

    const data = { ...body, createdBy: userId, role };

    const { errors } = Validator.isSchemaValid({ data, schema: createSchema });

    if (errors) {
      return res.badRequest('field-validation', errors);
    }

    const { errors: err, doc } = await UserService.create(data);

    if (doc) {
      const { publicId, adminPassword } = doc;

      res.setHeader('message', 'created!');
      res.setHeader('public-id', publicId);
      res.setHeader('admin-password', adminPassword);

      return res.postRequest(doc);
    }

    return res.badRequest('field-validation', err);
  } catch (error) {
    return res.serverError(error);
  }
};

const getList = async (req, res) => {
  try {
    const { auth: { userId }, query } = req;

    const {
      pageSize, pageNumber, name, email, mobileNumber, status,
    } = query;
    const limit = parseInt(pageSize) || 10;
    const offset = limit * ((parseInt(pageNumber) || 1) - 1);

    const data = {
      userId, limit, offset, name, email, mobileNumber, status,
    };

    const { count, doc } = await UserService.getList(data);

    res.setHeader('x-coreplatform-paging-limit', count);
    res.setHeader('x-coreplatform-total-records', count);

    return res.getRequest(doc);
  } catch (error) {
    return res.serverError(error);
  }
};

const deleted = async (req, res) => {
  try {
    const { params: { publicId }, auth: { userId: updatedBy } } = req;

    const data = { publicId, updatedBy };

    const is = Validator.isValidUuid(publicId);

    if (is) {
      const { errors, doc } = await UserService.deleted(data);

      if (doc) {
        res.setHeader('message', 'successfully deleted!');

        return res.deleted();
      }

      return res.badRequest('field-validation', errors);
    }

    return res.badRequest('field-validation', [ { name: 'publicId', message: 'invalid publicId!' } ]);
  } catch (error) {
    return res.serverError(error);
  }
};

const update = async (req, res) => {
  try {
    const {
      body, params: { publicId }, auth: { userId: updatedBy, role }, headers: { 'x-coreplatform-concurrencystamp': concurrencyStamp },
    } = req;

    const data = {
      ...body, publicId, updatedBy, concurrencyStamp, role,
    };

    const { errors: validationErrors, data: validatedData } = Validator.isSchemaValid({ data, schema: updateSchema });

    if (validationErrors) {
      return res.badRequest('field-validation', validationErrors);
    }

    const { errors, concurrencyError, doc } = await UserService.update(validatedData);

    if (concurrencyError) {
      return res.concurrencyError();
    }

    if (doc) {
      res.setHeader('message', 'successfully updated!');
      res.setHeader('public-id', publicId);

      return res.updated();
    }

    return res.badRequest('field-validation', errors);
  } catch (error) {
    return res.serverError(error);
  }
};

module.exports = {
  create,
  getList,
  deleted,
  update,
};
