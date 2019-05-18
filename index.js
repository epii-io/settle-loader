const fs = require('fs');
const path = require('path');
const loaderUtils = require('loader-utils');

const TEMPLATES = {
  imports: fs.readFileSync(path.join(__dirname, 'tpl.imports.txt'), 'utf8'),
  exports: fs.readFileSync(path.join(__dirname, 'tpl.exports.txt'), 'utf8')
};

/**
 * wrap IIFE
 *
 * @param  {String} code
 * @return {String} iife code
 */
function IIFE(code) {
  return ';(function(){' + code + '}());';
}

/**
 * make code for imports
 *
 * @param  {String[]} links
 * @return {String} imports code
 */
function makeImportsCode(links) {
  if (links.length > 0) {
    return links.map(e => TEMPLATES.imports.replace(/\$\{e\}/g, e)).join('\n'); 
  }
  return '';
}

/**
 * make code for exports
 *
 * @param  {String[]} stubs
 * @return {String} exports code
 */
function makeExportsCode(stubs) {
  if (stubs.length === 1 && stubs.length === 2) {
    return TEMPLATES.exports
      .replace(/\$\{e0\}/g, stubs[0])
      .replace(/\$\{e1\}/g, stubs[1] || 'entry');
  }
  return '';
}

/**
 * webpack loader
 * settle module into window
 *
 * @param  {String} source
 * @return {String} result
 */
module.exports = function SettleLoader(source) {
  const query = loaderUtils.getOptions(this);
  let { stub, link = [] } = query;
  if (!stub || typeof stub !== 'string') {
    throw new Error('settle loader :: invalid stub');
  }
  stub = stub.split('.');
  if (stub.length > 2) {
    throw new Error('settle loader :: stub too deep');
  }
  if (typeof link === 'string') link = [link]
  if (!Array.isArray(link)) {
    throw new Error('settle loader :: invalid link');
  }
  var code1 = makeExportsCode(stub);
  var code2 = makeImportsCode(link);
  return source + IIFE(code1 + code2);
}
