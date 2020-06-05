import benchmark from 'benchmark';
import match from '../index.js';
import nano from 'nanomatch';
import micromatch from 'micromatch';

const matches = [
    {string: 'abc', pattern: 'a?c'},
    {string: 'abcde', pattern: 'a?c?e'},
    {string: 'abcde', pattern: 'a?c?e'},
    {string: 'The quick brown fox jumps over the lazy dog', pattern: '*fox*'}
];

const options = {
    initCount: 1,
    maxTime: 4
};

const cycle = function(event) {
    if (!event.target.error) {
        console.log(String(event.target));
    }
};

const matchers = [
    function(str, pat) {
        this.name = 'fastwildcard';
        this.pattern = pat;
        this.match = match;
    },
    function(str, pat) {
        this.name = 'string.match';
        const pattern = this.pattern = '^' + pat.replace(/\*/g, '.*').replace(/\?/g, '.') + '$';
        this.match = (str) => str.match(pattern);
    },
    function(str, pat) {
        this.name = 'RegExp';
        this.pattern = '^' + pat.replace(/\*/g, '.*').replace(/\?/g, '.') + '$';
        const re = new RegExp(this.pattern);
        this.match = (str) => re.test(str);
    },
    function(str, pat) {
        this.name = 'nanomatch';
        this.pattern = pat;
        this.match = nano;
    },
    function(str, pat) {
        this.name = 'micromatch';
        this.pattern = pat;
        this.match = micromatch.isMatch;
    }
];

const suites = [];

matches.forEach(item => {
    const suite = new benchmark.Suite();
    matchers.forEach(constructor => {
        const matcher = new constructor(item.string, item.pattern);
        suite.add(`${matcher.name}: '${item.string}' with '${matcher.pattern}'`, () => {
            matcher.match(item.string, item.pattern);
        }, options);
    });
    suites.push(suite);
});

suites.forEach(function(suite) {
    suite
        .on('cycle', cycle)
        .run();
});
