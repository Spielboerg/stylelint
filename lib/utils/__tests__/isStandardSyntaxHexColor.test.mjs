import isStandardSyntaxHexColor from '../isStandardSyntaxHexColor.js';

describe('isStandardSyntaxHexColor', () => {
	it('default hex', () => {
		expect(isStandardSyntaxHexColor('#000000')).toBe(true);
	});
	it('less map usage', () => {
		expect(isStandardSyntaxHexColor('#prop[someprop]')).toBe(false);
	});
});
