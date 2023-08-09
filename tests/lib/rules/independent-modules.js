/**
 * @fileoverview independent modules
 * @author Deland
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/independent-modules"),
  RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
ruleTester.run("independent-modules", rule, {
  valid: [
    // give me some code that won't trigger a warning
    // {
    //   code: 'import b from \'./sibling.js\'',
    //   filename: '/User/src/views/A/index.js',
    //   parserOptions: {
    //     ecmaVersion: 6,
    //     sourceType: 'module',
    //   },
    // },
  ],

  invalid: [
    // {
    //   code: 'import b from \'../../B/index\'',
    //   filename: '/User/src/views/A/index.js',
    //   errors: [
    //     {
    //       message: 'Dirnames in \''
    //           + '\' should match pattern: \'^[a-zA-Z0-9_-]+$\'',
    //     },
    //   ],
    //   parserOptions: {
    //     ecmaVersion: 6,
    //     sourceType: 'module',
    //   },
    // },
  ],
});
