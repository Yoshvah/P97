const { override } = require('customize-cra');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

module.exports = override(/* other overrides if any */);
