import checkInvalidCLIOptions from '../checkInvalidCLIOptions.js';

import { EOL } from 'node:os';
import picocolors from 'picocolors';

const { red: r, cyan: c } = picocolors;

describe('checkInvalidCLIOptions', () => {
	const allowedOptions = {
		fix: {},
		config: {},
		maxWar: { alias: 'mw' },
		quiet: { alias: 'q' },
	};

	it('returns a message when check fails', () => {
		const inputOptions = {
			fis: true,
			fi: true,
			fixx: true,
			aix: true,
			conig: true,
			mxWar: true,
			ma: true,
			q: true,
			o: true,
		};

		expect(checkInvalidCLIOptions(allowedOptions, inputOptions)).toBe(
			`Invalid option ${r('"--fis"')}. Did you mean ${c('"--fix"')}?
Invalid option ${r('"--fi"')}. Did you mean ${c('"--fix"')}?
Invalid option ${r('"--fixx"')}. Did you mean ${c('"--fix"')}?
Invalid option ${r('"--aix"')}. Did you mean ${c('"--fix"')}?
Invalid option ${r('"--conig"')}. Did you mean ${c('"--config"')}?
Invalid option ${r('"--mx-war"')}. Did you mean ${c('"--max-war"')}?
Invalid option ${r('"--ma"')}. Did you mean ${c('"--mw"')}?
Invalid option ${r('"-o"')}.
`.replace(/\n/g, EOL),
		);
	});

	it('returns an empty string when check succeeds', () => {
		expect(checkInvalidCLIOptions(allowedOptions, {})).toBe('');
		expect(
			checkInvalidCLIOptions(allowedOptions, {
				fix: true,
				config: true,
				maxWar: true,
				mw: true,
				quiet: true,
				q: true,
			}),
		).toBe('');
	});
});
