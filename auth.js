const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const ms = require('ms');
const moment = require('moment');
const { pem2jwk } = require('pem-jwk');
const jwkToPem = require('jwk-to-pem');

const Helper = require('../utils/helper');

const { client: ClientModel } = require('../database/ids');

const { REFRESH_TOKEN } = require('../utils/constant');

const signTokenByClientId = async (payload, client) => {
  const {
    refreshExpiresIn, audience, privateKey, issuer, subject, expiresIn, algorithm, keyId: keyid,
  } = client;
  // const SUPPORTED_ALGS = ['RS256', 'RS384', 'RS512', 'ES256', 'ES384', 'ES512', 'HS256', 'HS384', 'HS512', 'none'];

  const signOptions = {
    issuer,
    subject,
    audience: [ audience ],
    expiresIn,
    algorithm,
    keyid,
  };
  const key = privateKey.toString();

  const token = await jwt.sign({ ...payload, keyid }, key, signOptions);

  const refreshToken = await jwt.sign(
    { ...payload },
    key,
    { ...signOptions, expiresIn: refreshExpiresIn, audience: [ REFRESH_TOKEN ] },
  );

  return {
    token, refreshToken, expiresIn: moment().add(ms(expiresIn), 'milliseconds'),
  };
};

const signToken = async (payload, client) => {
  const {
    refreshExpiresIn, privateKey, issuer, subject, expiresIn, algorithm, keyId: keyid, audience,
  } = client;

  const signOptions = {
    issuer,
    subject,
    audience: [ audience ],
    expiresIn,
    algorithm,
    keyid,
  };
  const key = privateKey.toString();

  const token = await jwt.sign({ ...payload, keyid }, key, signOptions);

  if (refreshExpiresIn) {
    const refreshToken = await jwt.sign(
      { ...payload },
      key,
      { ...signOptions, expiresIn: refreshExpiresIn, audience: [ REFRESH_TOKEN ] },
    );

    return {
      token, refreshToken, expiresIn: moment().add(ms(expiresIn), 'milliseconds'),
    };
  }

  return {
    token, expiresIn: moment().add(ms(expiresIn), 'milliseconds'),
  };
};

const destroy = async (token) => {
  const result = jwt.decode(token, { complete: true });

  if (result) {
    const { header, payload: { jti } } = result;

    if (header) {
      const { kid } = header;
      const { public_key: publicKey } = await ClientModel.findOne({ where: { key_id: kid } });

      const key = publicKey.toString();

      const response = await jwt.destroy(jti, key);

      return { doc: { response } };
    }

    return { errors: [ { message: 'invalid token', name: 'token' } ] };
  }

  return { errors: [ { message: 'invalid token', name: 'token' } ] };
};

const jwks = async () => {
  const response = await ClientModel.findAll({ where: { is_deleted: false }, order: [ [ 'id', 'asc' ] ] });

  const results = response.map((element) => {
    const { public_key: publicKey, algorithm: alg, key_id: kid } = element;
    const jwk = pem2jwk(publicKey);

    return {
      ...jwk, use: 'sig', alg, kid,
    };
  });

  return { keys: results };
};

const verify = async (token, { publicKey, JWKS_URL }) => {
  const result = jwt.decode(token, { complete: true });

  if (result) {
    const { header } = result;

    if (header) {
      if (JWKS_URL) {
        const { errors, data } = await Helper.getRequest({ url: JWKS_URL });

        if (errors) {
          return false;
        }
        const { keys } = data;
        let isValid = false;

        await Promise.all(keys.map(async (element) => {
          const pem = jwkToPem(element);

          try {
            const is = await jwt.verify(token, pem);

            if (is) {
              isValid = is;
            }

            return is;
          } catch (error) {
            return false;
          }
        }));

        return isValid;
      }

      const key = publicKey.toString();

      const is = await jwt.verify(token, key);

      return is;
    }

    return false;
  }

  return false;
};

const refresh = async (refreshToken) => {
  const result = jwt.decode(refreshToken, { complete: true });

  if (result) {
    const { header, payload } = result;

    if (header) {
      const { kid: keyid } = header;
      const {
        iat, exp, aud, iss, sub, jti, ...newPayload
      } = payload;
      const {
        refresh_expires_in: refreshExpiresIn, private_key: privateKey, issuer, subject, expires_in: expiresIn, algorithm, audience,
      } = await ClientModel.findOne({ where: { key_id: keyid } });

      const signOptions = {
        issuer,
        subject,
        audience: [ audience ],
        expiresIn,
        algorithm,
        keyid,
      };

      const token = await jwt.sign({ ...newPayload }, privateKey.toString(), signOptions);

      const newRefreshToken = await jwt.sign(
        { ...newPayload },
        privateKey.toString(),
        { ...signOptions, expiresIn: refreshExpiresIn, audience: [ REFRESH_TOKEN ] },
      );

      // await jwt.destroy(jti, publicKey.toString());

      return {
        token, refreshToken: newRefreshToken, expiresIn: moment().add(ms(expiresIn), 'milliseconds'),
      };
    }

    return false;
  }

  return false;
};

const encryptPassword = (password, salt) => {
  const hashedPassword = crypto.pbkdf2Sync(password, Buffer.from(salt, 'base64'), 10000, 128, 'sha512').toString('base64');

  return hashedPassword;
};

const makeSalt = () => crypto.randomBytes(16).toString('base64');

const verifyPassword = (hashedPassword = '', password = '', salt = '') => encryptPassword(password, salt) === hashedPassword;

module.exports = {
  jwks,
  verify,
  encryptPassword,
  makeSalt,
  verifyPassword,
  signToken,
  destroy,
  refresh,
  signTokenByClientId,
};
