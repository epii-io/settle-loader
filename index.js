const fs = require('fs');
const path = require('path');
const loaderUtils = require('loader-utils');

const launchCode = fs.readFileSync(path.join(__dirname, 'tpl.launch.txt'), 'utf8');

/**
 * wrap IIFE
 *
 * @param  {String} code
 * @return {String} iife code
 */
function IIFE(code) {
  return ';(function(){' + code + '}());';
}

function makeAlwaysExportDefault(code) {
  const hasDefault = /export\s+default/.test(code);
  if (hasDefault) return code;
  const onlyExport = code.split('export').length === 2;
  if (!onlyExport) {
    throw new Error('launch loader :: too many export');
  }
  return code;
}

function makeLaunchCode(global, holder) {
  const globals = global.split('.');
  const result = launchCode
    .replace(/global\.0/g, globals[0])
    .replace(/global\.1/g, globals[1])
    .replace(/holder/g, holder);
  return IIFE(result);
}

/**
 * launch-loader
 *
 * @param  {String} source
 * @return {String} result
 */
module.exports = function LaunchLoader(source) {
  const query = loaderUtils.getOptions(this);
  let { global, holder } = query;
  if (!global || typeof global !== 'string') {
    throw new Error('launch loader :: global should be string');
  }
  if (global.split('.').length !== 2) {
    throw new Error('launch loader :: global should be like a.b');
  }
  if (!holder || typeof holder !== 'string') {
    throw new Error('launch loader :: holder should be string');
  }
  return makeAlwaysExportDefault(source) + makeLaunchCode(global, holder);
}
