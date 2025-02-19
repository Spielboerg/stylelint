'use strict';

const declarationValueIndex = require('../../utils/declarationValueIndex');
const getDeclarationValue = require('../../utils/getDeclarationValue');
const isStandardSyntaxFunction = require('../../utils/isStandardSyntaxFunction');
const { camelCaseFunctions } = require('../../reference/functions');
const optionsMatches = require('../../utils/optionsMatches');
const report = require('../../utils/report');
const ruleMessages = require('../../utils/ruleMessages');
const setDeclarationValue = require('../../utils/setDeclarationValue');
const validateOptions = require('../../utils/validateOptions');
const valueParser = require('postcss-value-parser');
const { isRegExp, isString } = require('../../utils/validateTypes');
const isStandardSyntaxValue = require('../../utils/isStandardSyntaxValue');

const ruleName = 'function-name-case';

const messages = ruleMessages(ruleName, {
	expected: (actual, expected) => `Expected "${actual}" to be "${expected}"`,
});

const meta = {
	url: 'https://stylelint.io/user-guide/rules/function-name-case',
	fixable: true,
};

const mapLowercaseFunctionNamesToCamelCase = new Map();

for (const func of camelCaseFunctions) {
	mapLowercaseFunctionNamesToCamelCase.set(func.toLowerCase(), func);
}

/** @type {import('stylelint').Rule} */
const rule = (primary, secondaryOptions, context) => {
	return (root, result) => {
		const validOptions = validateOptions(
			result,
			ruleName,
			{
				actual: primary,
				possible: ['lower', 'upper'],
			},
			{
				actual: secondaryOptions,
				possible: {
					ignoreFunctions: [isString, isRegExp],
				},
				optional: true,
			},
		);

		if (!validOptions) {
			return;
		}

		root.walkDecls((decl) => {
			if (!decl.value.includes('(')) return;

			if (!isStandardSyntaxValue(decl.value)) return;

			let needFix = false;
			const parsed = valueParser(getDeclarationValue(decl));

			parsed.walk((node) => {
				if (node.type !== 'function' || !isStandardSyntaxFunction(node)) {
					return;
				}

				const functionName = node.value;
				const functionNameLowerCase = functionName.toLowerCase();

				if (optionsMatches(secondaryOptions, 'ignoreFunctions', functionName)) {
					return;
				}

				let expectedFunctionName = null;

				if (
					primary === 'lower' &&
					mapLowercaseFunctionNamesToCamelCase.has(functionNameLowerCase)
				) {
					expectedFunctionName = mapLowercaseFunctionNamesToCamelCase.get(functionNameLowerCase);
				} else if (primary === 'lower') {
					expectedFunctionName = functionNameLowerCase;
				} else {
					expectedFunctionName = functionName.toUpperCase();
				}

				if (functionName === expectedFunctionName) {
					return;
				}

				if (context.fix) {
					needFix = true;
					node.value = expectedFunctionName;

					return;
				}

				report({
					message: messages.expected,
					messageArgs: [functionName, expectedFunctionName],
					node: decl,
					index: declarationValueIndex(decl) + node.sourceIndex,
					result,
					ruleName,
				});
			});

			if (context.fix && needFix) {
				setDeclarationValue(decl, parsed.toString());
			}
		});
	};
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;
module.exports = rule;
