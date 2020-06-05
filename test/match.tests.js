import test from 'ava';
import match from '../index.js';

test('Null input string should throw', t => {
	t.throws(() => match(null, 'a?c'));
});

test('Invalid patterns shold throw', t => {
	t.throws(() => match('abc', null));
	t.throws(() => match('abc', ''));
	t.throws(() => match('abc'));
});

test('Partial match should return false', t => {
	t.false(match('ab', 'a?c'));
	t.false(match('abc', 'a?'));
	t.false(match('abc', ' '));
});

test('Single character wildcard should match', t => {
	t.true(match('a', '?'));
	t.true(match('abc', 'a?c'));
	t.true(match('abcde', 'a?c?e'));
	t.true(match('abcde', 'a???e'));
	t.true(match('abcde', '?bcde'));
	t.true(match('abcde', 'abcd?'));
});

test('Single character wildcard should not match', t => {
	t.false(match('bbcde', 'a?cde'));
	t.false(match('bacde', '?bcde'));
	t.false(match('bbcde', 'abcd?'));
});

test('Multi character wildcard should match length edge cases', t => {
	t.true(match('', '*'));
	t.true(match(' ', '*'));
	t.true(match(' ', '**'));
	t.true(match(' ', '***'));
});

test('Multi character wildcard should match', t => {
	t.true(match('aaa', 'a*a'));
	t.true(match('abc', 'a*c'));
	t.true(match('abcde', 'a*e'));
	t.true(match('abcde', 'a**e'));
	t.true(match('abcde', '*bcde'));
	t.true(match('abcde', 'abcd*'));
	t.true(match('abcdefg', '*bc*fg'));
	t.true(match('abc/def/ghi', 'abc*/ghi'));
	t.true(match('abc/def/ghi', 'abc/*/ghi'));
	t.true(match('abc/def/ghi', '*/ghi'));
	t.true(match('aabbccaabbddaabbee', 'a*b*a*e'));
	t.true(match('aabbccaabbddaabbee', 'a*b*a*ee'));
});

test('Multi character wildcard should match to blank', t => {
	t.true(match('aa', 'a*a'));
	t.true(match('abc', 'a*bc'));
	t.true(match('abc', '*abc'));
	t.true(match('abc', 'abc*'));
	t.true(match('abc', '*a*'));
	t.true(match('abc', '*b*'));
	t.true(match('abc', '*c*'));
	t.true(match('abcde', 'a*b*c*d*e'));
});

test('Multi character wildcard should not match', t => {
	t.false(match('abbde', 'a*cde'));
	t.false(match('bbcde', 'a*cde'));
	t.false(match('bacde', '*bcde'));
	t.false(match('bbcde', 'abcd*'));
	t.false(match('abc', 'a*bc*de'));
});

test('Mixed wildcards should match', t => {
	t.true(match('ab', 'a?*'));
	t.true(match('abcde', 'a?c*e'));
	t.true(match('abcde', 'a*c?e'));
	t.true(match('abcde', 'a?*de'));
	t.true(match('aabbccaabbddaabbee', 'a*b?cca*b*ee'));
});

test('Multi wildcards should match length edge cases', t => {
	t.true(match(' ', '?*'));
	t.true(match(' ', '*?'));
	t.true(match(' ', '*?*'));
	t.true(match('  ', '*?*?*'));
});

test('No wildcards should match', t => {
	t.true(match('abcde', 'abcde'));
	t.true(match(' ', ' '));
});

test('No wildcards should not match', t => {
	t.false(match('abbde', 'abcde'));
	t.false(match(' ', '  '));
	t.false(match('  ', ' '));
});
