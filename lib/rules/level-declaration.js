/**
 * @fileoverview level decalration
 * @author Deland
 */
'use strict';
const path = require('path');
const get = require('lodash.get');
const startsWith = require('lodash.startswith');
const utils = require('../utils');

const resolveAlias = utils.resolveAlias;
const getIsInternalSource = utils.getIsInternalSource;

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

var modulesPaths = null;

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

/**
  * @type {import('eslint').Rule.RuleModule}
  */
module.exports = {
    meta: {
        type: 'problem', // `problem`, `suggestion`, or `layout`
        docs: {
            description: 'component limit',
            category: 'Fill me in',
            recommended: false,
            url: null, // URL to the documentation page for this rule
        },
        fixable: null, // Or `code` or `whitespace`
        schema: [
            {
                type: 'array',
                minItems: 2,
                items: {
                    type: 'string',
                },
            },
        ], // Add a schema if the rule has options
    },

    create(context) {
        const cwd = context.getCwd();
        const options = context.options || [];
        const modules = options[0];
        const filePath = context.getFilename(); // 获取当前文件路径

        if (!options.length) {
            return;
        }

        if (!modulesPaths) { // 生成配置的路径数组
            modulesPaths = modules.map(item => (cwd + path.sep + item));
        }

        const settings = context.settings || {};
        const aliasSetting = get(settings, 'import-limits.alias') || {};

        // eslint-disable-next-line consistent-return
        return {
            // visitor functions for different types of nodes
            ImportDeclaration: node => {
                const source = node.source.value; // 获取当前引用资源路径
                const filePathInfo = path.parse(filePath); // 解析当前路径

                // source是否内部依赖，如果是node_modules中的模块则为false
                const isInternalSource = getIsInternalSource(source, aliasSetting);
                if (!isInternalSource) { // 如果source不是内部依赖，直接return
                    return;
                }

                // 获取当前文件匹配到配置数组中的路径，匹配不到则不检测直接return
                var matchModulePath = modulesPaths.find(item => startsWith(filePath, item));
                if (!matchModulePath) { // 如果当前文件不属于 options 中设置的modules，直接return
                    return;
                }

                // 找到当前文件所属模块的matchModule中的下标
                const matchModulePathIdx = modulesPaths.indexOf(matchModulePath);


                const resolvedSourcePath = resolveAlias(source, aliasSetting); // 处理 source 可能包含 alias 的情况
                const absoluteSourcePath = path.resolve(filePathInfo.dir, resolvedSourcePath); // source 的绝对路径

                // 获取引用路径匹配到配置数组中的路径，匹配不到则直接return
                const sourceMatchModulePath = modulesPaths.find(item => startsWith(absoluteSourcePath, item));
                if (!sourceMatchModulePath) { // 如果source不属于options中设置的modules，直接return
                    return;
                }

                // 找到引用文件所属模块的matchModule中的下标
                const sourceMatchModulePathIdx = modulesPaths.indexOf(sourceMatchModulePath);

                // 判断如果模板引用idx大于当前文件路径idx 则抛出错误
                if (sourceMatchModulePathIdx > matchModulePathIdx) {
                    context.report({
                        node,
                        message: '{{currentModule}} can\'t import from {{sourceModule}}',
                        data: {
                            sourceModule: modules[sourceMatchModulePathIdx],
                            currentModule: modules[matchModulePathIdx],
                        },
                    });
                }
            },
        };
    },
};
