'use strict'

const loaderUtils = require('loader-utils')

/**
 * wrap IIFE
 *
 * @param  {String} code
 * @return {String} iife code
 */
function IIFE(code) {
  return ';(function(){' + code + '}());'
}

/**
 * webpack loader
 * settle module into window
 *
 * @param  {String} source
 * @return {String} result
 */
module.exports = function SettleLoader(source) {
  var query = loaderUtils.getOptions(this)
  var { stub, link = [] } = query
  if (!stub || typeof stub !== 'string') {
    throw new Error('settle loader :: invalid stub')
  }
  stub = stub.split('.')
  if (stub.length > 2) {
    throw new Error('settle loader :: too many level')
  }
  if (typeof link === 'string') link = [link]
  if (!Array.isArray(link)) {
    throw new Error('settle loader :: invalid link')
  }
  var code1 = `
    if (typeof window !== 'undefined') {
      if (!window.${stub[0]}) window.${stub[0]} = {};
      if (exports) {
        var keys = Object.keys(exports);
        if (keys.length > 0) {
          window.${stub[0]}.${stub[1] || 'entry'} =
            exports.default || exports[keys[0]];
        } else {
          console.warn('settle loader :: undefined')
        }
      };
    };
  `.replace(/\n|(\s{2})/g, '')
  var code2 = link.length > 0 ?
    link.map(e => `require('${e}');`).join('') : ''
  return source + IIFE(code1 + code2)
}
