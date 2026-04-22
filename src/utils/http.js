const { randomUUID } = require('node:crypto');

const json = (res, statusCode, payload) => {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body)
  });
  res.end(body);
};

const readJson = async (req) => {
  const chunks = [];

  for await (const chunk of req) {
    chunks.push(chunk);
  }

  if (chunks.length === 0) {
    return {};
  }

  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
};

const notFound = (res) => json(res, 404, { error: 'Not found' });

const badRequest = (res, message) => json(res, 400, { error: message });

const createdId = (prefix) => `${prefix}-${randomUUID().slice(0, 8)}`;

module.exports = { json, readJson, notFound, badRequest, createdId };
