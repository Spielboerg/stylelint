'use strict';

const blockString = require('../../utils/blockString');
const isSingleLineString = require('../../utils/isSingleLineString');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');
const { isNumber } = require('../../utils/validateTypes');

const ruleName = 'declaration-block-single-line-max-declarations';

const messages = ruleMessages(ruleName, {
	expected: (max) => `Expected no more than ${max} ${max === 1 ? 'declaration' : 'declarations'}`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/declaration-block-single-line-max-declarations',
};

/** @type {import('stylelint').Rule} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, {
			actual: primary,
			possible: [isNumber],
		});

		if (!validOptions) {
			return;
		}

		root.walkRules((ruleNode) => {
			const block = blockString(ruleNode);

			if (!isSingleLineString(block)) {
				return;
			}

			if (!ruleNode.nodes) {
				return;
			}

			const decls = ruleNode.nodes.filter((node) => node.type === 'decl');

			if (decls.length <= primary) {
				return;
			}

			report({
				message: messages.expected,
				messageArgs: [primary],
				node: ruleNode,
				word: block,
				result,
				ruleName,
			});
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
