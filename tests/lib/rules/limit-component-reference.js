/**
 * @fileoverview limit component deep call
 * @author Deland
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib/rules/level-declaration');
const RuleTester = require('eslint').RuleTester;


// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester();
ruleTester.run('level-declaration', rule, {
    valid: [
    // give me some code that won't trigger a warning
        //   {
    //   code: 'import b from \'../B/index.js\'',
    //   filename: '/Users/zhangzhi/Desktop/gitlab/eslint-plugin-limit-deep-call/src/views/A/index.js',
    //   parserOptions: {
    //     ecmaVersion: 6,
    //     sourceType: 'module',
    //   },
    // },
    ],

    invalid: [
    // {
    //   code: 'import {B} from \'@/business/utils/index.js\'',
    //   filename: '/Users/zhangzhi/Desktop/gitlab/eslint-plugin-limit-deep-call/src/common/index.js',
    //   errors: [
    //     {
    //       message: 'please see ',
    //     },
    //   ],
    //   parserOptions: {
    //     ecmaVersion: 6,
    //     sourceType: 'module',
    //   },
    // },
    ],
});
