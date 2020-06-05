const singleWildcardCharacter = '?';
const multiWildcardCharacter = '*';

/**
 *
 * @param {string} str
 * @param {string} pattern
 * @param {settings} [settings]
 */
export default function fastWidlcard(str, pattern, settings) {
	if (!pattern) {
		throw new Error('empty pattern');
	}
	if (!str && str !== '') {
		throw new Error('invalid str');
	}

	if (pattern === multiWildcardCharacter) {
		return true;
	}

	if (str === '') {
		return false;
	}

	settings = settings || {};
	if (settings.ignoreCase) {
		str = str.toLowerCase();
		pattern = pattern.toLowerCase();
	}

	const patLength = pattern.length;
	const strLength = str.length;

	const indexOfNextWildcard = (index) => {
		for (let i = index; i < patLength; i++) {
			const c = pattern[i];
			if (c === singleWildcardCharacter || c == multiWildcardCharacter) {
				return i;
			}
		}
		return -1;
	};

	let strIndex = 0;
	for (let patIndex = 0; patIndex < patLength; patIndex++) {
		const patternCh = pattern[patIndex];

		if (strIndex === strLength) {
			// At end of pattern for this longer string so always matches '*'
			return (patternCh === multiWildcardCharacter && patIndex == patLength - 1);
		}

		// Character match
		const strCh = str[strIndex];
		if (patternCh === singleWildcardCharacter || strCh === patternCh) {
			strIndex++;
			continue;
		}

		if (patternCh !== multiWildcardCharacter) {
			return false;
		}

		// Multi character wildcard - last character in the pattern
		if (patIndex === patLength - 1) {
			return true;
		}

		// Match pattern to input string character-by-character until the next wildcard (or end of string if there is none)
		const patternChMatchStartIndex = patIndex + 1;
		const nextWildcardIndex = indexOfNextWildcard(patternChMatchStartIndex);
		const patternChMatchEndIndex = nextWildcardIndex === -1 ? patLength : nextWildcardIndex;
		const comparison = pattern.slice(patternChMatchStartIndex, patternChMatchEndIndex);
		let skipToStringIndex = str.indexOf(comparison, strIndex);

		// Handle repeated instances of the same character at end of pattern
		if (nextWildcardIndex === -1 && comparison.length === 1) {
			let skipCandidateIndex = 0;
			while (skipCandidateIndex == 0) {
				const skipToStringIndexNew = skipToStringIndex + 1;
				skipCandidateIndex = str.indexOf(comparison, skipToStringIndexNew) - (skipToStringIndexNew);

				if (skipCandidateIndex == 0) {
					skipToStringIndex = skipToStringIndexNew;
				}
			}
		}

		if (skipToStringIndex == -1) {
			return false;
		}

		strIndex = skipToStringIndex;
	}


	// Pattern processing completed but rest of input string was not
	if (strIndex < strLength) {
		return false;
	}

	return true;
}
