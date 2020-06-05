import test from 'ava';
import match from '../index.js';

test('Should match pattern when case sensitive', t => {
	t.true(match('abc', 'a?c', {}));
});

test('Should NOT match pattern when case sensitive', t => {
	t.false(match('Abc', 'a?c', {}));
});

test('Should match pattern when case insensitive', t => {
	t.true(match('abc', 'a?c', {ignoreCase: true}));
	t.true(match('Abc', 'a?c', {ignoreCase: true}));
});
