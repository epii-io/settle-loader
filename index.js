const fs = require('fs');
const path = require('path');
const loaderUtils = require('loader-utils');

const launchCode = fs.readFileSync(path.join(__dirname, 'tpl.launch.txt'), 'utf8');

function findExportName(code) {
  const findOnlyExportName = [
    // export default class
    /export\s+default\s+class\s+(\w+)/,
    // export default function
    /export\s+default\s+function\s+(\w+)/,
    // export class
    /export\s+class\s+(\w+)/,
    // export function
    /export\s+function\s+(\w+)/
  ];
  for (let i = 0; i < findOnlyExportName.length; i ++) {
    const matches = code.match(findOnlyExportName[i]);
    if (matches && matches[1]) {
      // console.log('launch loader :: find first export name', matches[1]);
      return matches[1];
    }
  }
  return null;
}

function makeLaunchCode(global, holder, target) {
  if (!target) {
    throw new Error('launch loader :: export name not found')
  }
  const globals = global.split('.');
  const result = launchCode
    .replace(/\$\{global0\}/g, globals[0])
    .replace(/\$\{global1\}/g, globals[1])
    .replace(/\$\{holder\}/g, holder)
    .replace(/\$\{target\}/g, target);
  return result;
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
  const exportName = findExportName(source);
  const result = source + '\n' + makeLaunchCode(global, holder, exportName);
  return result;
}
