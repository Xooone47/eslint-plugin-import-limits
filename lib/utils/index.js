'use strict';
var startsWith = require('lodash.startswith');

// get if originPath matched one of the giving alias
function matchedAlias(originPath, aliasSet) {
    if (!aliasSet) {
        return '';
    }

    var keys = Object.keys(aliasSet);
    var target = keys.find(item => startsWith(originPath, item));
    return target || '';
}

// eg:
// resolveAlias('@/components/Input', {'@': '/Myroot/src/demo/src'}) => /Myroot/src/demo/src/components/Input
// resolveAlias('footer', {'footer': './footer/overridden.js'}) => ./footer/overridden.js
function resolveAlias(originPath, alias) {
    var aliasFrom = matchedAlias(originPath, alias);
    var aliasTo = aliasFrom ? alias[aliasFrom] : '';

    if (!aliasFrom) {
        return originPath;
    }

    var result = originPath.replace(aliasFrom, aliasTo);
    return result;
}

// 判断当前 source 是否内部依赖，为第三方依赖时返回false
// NOTE 暂不支持绝对路径的判断
function getIsInternalSource(source, aliasSetting) {
    if (source.startsWith('.')) {
        return true;
    }
    return !!matchedAlias(source, aliasSetting);
}

module.exports = {
    resolveAlias,
    matchedAlias,
    getIsInternalSource,
};
