/**
 * @fileoverview limit the module dependencies
 * @author Deland
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const requireIndex = require('requireindex');

// ------------------------------------------------------------------------------
// Plugin Definition
// ------------------------------------------------------------------------------


// import all rules in lib/rules
module.exports.rules = requireIndex(__dirname + '/rules');


