/**
 * @fileoverview independent modules
 * @author Siqi Li
 */
'use strict';
var path = require('path');
var get = require('lodash.get');
var startsWith = require('lodash.startswith');
var utils = require('../utils');

var resolveAlias = utils.resolveAlias;
var getIsInternalSource = utils.getIsInternalSource;

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

function getCurrentModule(currentPath, modulePath) {
    var reletivePath = currentPath.replace(modulePath + path.sep, '');
    var currentModule = reletivePath.split(path.sep)[0];
    return currentModule;
}

var modulesPaths = null;

/**
 * @type {import('eslint').Rule.RuleModule}
 */
module.exports = {
    meta: {
        type: 'problem', // `problem`, `suggestion`, or `layout`
        docs: {
            description: 'independent modules',
            category: 'Fill me in',
            recommended: false,
            url: '', // URL to the documentation page for this rule
        },
        fixable: null, // Or `code` or `whitespace`
        schema: [ // Add a schema if the rule has options
            {
                type: 'array',
                minItems: 1,
                items: {
                    type: 'string',
                },
            },
        ],
    },

    create(context) {
        var cwd = context.getCwd();
        var options = context.options || [];

        if (!options.length) {
            return;
        }

        if (!modulesPaths) {
            var modules = options[0];
            modulesPaths = modules.map(item => ({
                origin: item,
                resolved: cwd + path.sep + item,
            }));
        }

        var settings = context.settings || {};
        var aliasSetting = get(settings, 'import-limits.alias') || {};

        // eslint-disable-next-line consistent-return
        return {
            // visitor functions for different types of nodes
            'ImportDeclaration': function (node) {
                var filePath = context.getFilename();
                var filePathInfo = path.parse(filePath);
                var source = node.source.value;

                // source是否内部依赖，如果是node_modules中的模块则为false
                var isInternalSource = getIsInternalSource(source, aliasSetting);
                if (!isInternalSource) { // 如果source不是内部依赖，直接return
                    return;
                }

                var matchModulePath = modulesPaths.find(item => startsWith(filePath, item.resolved));
                if (!matchModulePath) { // 如果当前文件不属于 options 中设置的modules，直接return
                    return;
                }

                var resolvedSourcePath = resolveAlias(source, aliasSetting); // 处理 source 可能包含 alias 的情况
                var absoluteSourcePath = path.resolve(filePathInfo.dir, resolvedSourcePath); // source 的绝对路径

                var sourceModule = getCurrentModule(absoluteSourcePath, matchModulePath.resolved); // source的 module
                if (!sourceModule) { // 如果source不属于options中设置的modules，直接return
                    return;
                }

                var currentModule = getCurrentModule(filePath, matchModulePath.resolved); // 当前文件的 module

                if (currentModule !== sourceModule) {
                    // console.log(node)
                    // console.log(cwd)
                    // console.log(options)
                    // console.log(aliasSetting)
                    // console.log(context.getSourceCode())
                    // console.log('source', source)
                    // console.log('resolvedSourcePath', resolvedSourcePath)
                    // console.log('currentModule', currentModule)
                    // console.log('sourceModule', sourceModule)
                    // console.log('absoluteSourcePath', absoluteSourcePath)
                    // console.log('filePathInfo', filePathInfo)

                    context.report({
                        node,
                        message: 'Can\'t import from {{sourceModule}}',
                        data: {
                            sourceModule: matchModulePath.origin + path.sep + sourceModule,
                        },
                    });
                }
            },
        };
    },
};
