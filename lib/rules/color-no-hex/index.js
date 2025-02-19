'use strict';

const valueParser = require('postcss-value-parser');

const declarationValueIndex = require('../../utils/declarationValueIndex');
const getDeclarationValue = require('../../utils/getDeclarationValue');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const validateOptions = require('../../utils/validateOptions');

const ruleName = 'color-no-hex';

const messages = ruleMessages(ruleName, {
	rejected: (hex) => `Unexpected hex color "${hex}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/color-no-hex',
};

const HEX = /^#[\da-z]+$/i;
const CONTAINS_HEX = /#[\da-z]+/i;
const IGNORED_FUNCTIONS = new Set(['url']);

/** @type {import('stylelint').Rule} */
const rule = (primary) => {
	return (root, result) => {
		const validOptions = validateOptions(result, ruleName, { actual: primary });

		if (!validOptions) {
			return;
		}

		root.walkDecls((decl) => {
			if (!CONTAINS_HEX.test(decl.value)) return;

			const parsedValue = valueParser(getDeclarationValue(decl));

			parsedValue.walk((node) => {
				if (isIgnoredFunction(node)) return false;

				if (!isHexColor(node)) return;

				const index = declarationValueIndex(decl) + node.sourceIndex;
				const endIndex = index + node.value.length;

				report({
					message: messages.rejected,
					messageArgs: [node.value],
					node: decl,
					index,
					endIndex,
					result,
					ruleName,
				});
			});
		});
	};
};

/**
 * @param {import('postcss-value-parser').Node} node
 */
function isIgnoredFunction({ type, value }) {
	return type === 'function' && IGNORED_FUNCTIONS.has(value.toLowerCase());
}

/**
 * @param {import('postcss-value-parser').Node} node
 */
function isHexColor({ type, value }) {
	return type === 'word' && HEX.test(value);
}

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
