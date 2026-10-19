const test = require('node:test');
const assert = require('node:assert/strict');

const { isVectorSearchError, buildTextSearchRegex } = require('../controllers/searchController');

test('detects missing vector index errors', () => {
  const error = new Error('MongoServerError: no such index: vector_index');
  assert.equal(isVectorSearchError(error), true);
});

test('builds a safe regex for multi-word queries', () => {
  const regex = buildTextSearchRegex('project plan + review');
  assert.equal(regex instanceof RegExp, true);
  assert.match(regex.source, /project|plan|review/);
});
