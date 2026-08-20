'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');

const {
    forwardCollatz,
    reversePredecessors,
    toMK,
    generateReverseTree,
    levelCounts,
    largestPrimeFactor,
    next233,
    find233Cycle
} = require('../collatz-math.js');

const EXPECTED_233_CYCLE = [
    233, 2333, 23333, 233333, 6611, 6011, 60111, 66799, 9977,
    9077, 3133, 2411, 24111, 477, 533, 411, 1377, 177, 599, 5999,
    8577, 9533, 95333, 136199, 194577, 8211
];

test('reverse predecessors map back under the forward Collatz rule', () => {
    const { parentMap } = generateReverseTree(1, 24, { pruneRootCycle: true });
    for (const [child, parent] of parentMap.entries()) {
        if (parent === null) continue;
        assert.equal(forwardCollatz(child), parent, `${child} should map forward to ${parent}`);
    }
});

test('cycle pruning omits only the root-cycle predecessor at node 4', () => {
    assert.deepEqual(reversePredecessors(4, { pruneRootCycle: true }), [8]);
    assert.deepEqual(reversePredecessors(4, { pruneRootCycle: false }), [8, 1]);
    assert.deepEqual(reversePredecessors(16, { pruneRootCycle: true }), [32, 5]);
});

test('(m,k) coordinates round trip and correctly encode the odd predecessor of 16', () => {
    for (let value = 1; value <= 10000; value += 1) {
        const { m, k } = toMK(value);
        assert.equal((6 * m) + k, value);
        assert.ok(k >= 0 && k < 6);
    }
    assert.deepEqual(toMK((16 - 1) / 3), { m: 0, k: 5 });
});

test('known root-1 node counts match the implemented cycle-pruned generator', () => {
    const expected = new Map([
        [4, 5],
        [8, 17],
        [12, 47],
        [20, 342],
        [27, 1748],
        [30, 3518]
    ]);

    for (const [depth, count] of expected.entries()) {
        assert.equal(generateReverseTree(1, depth).stepsMap.size, count, `depth ${depth}`);
    }
});

test('T5 and T32 are disproved as isomorphic by their level counts', () => {
    const counts5 = levelCounts(5, 12);
    const counts32 = levelCounts(32, 12);

    assert.deepEqual(counts5.slice(0, 11), counts32.slice(0, 11));
    assert.equal(counts5[11], 15);
    assert.equal(counts32[11], 14);
    assert.notDeepEqual(counts5, counts32);

    assert.equal(11 % 6, 5);
    assert.equal(75 % 6, 3);
    assert.deepEqual(reversePredecessors(22), [44, 7]);
    assert.deepEqual(reversePredecessors(150), [300]);
});

test('largest-prime-factor recurrence sends 9533 to 95333', () => {
    assert.equal(largestPrimeFactor(9533), 9533);
    assert.equal(next233(9533), 95333);
});

test('the stated recurrence has the documented 26-state cycle from 233', () => {
    const result = find233Cycle(233);
    assert.deepEqual(result.preperiod, []);
    assert.deepEqual(result.cycle, EXPECTED_233_CYCLE);
    assert.equal(result.cycle.length, 26);
    assert.equal(result.repeatedValue, 233);
    assert.equal(next233(result.cycle.at(-1)), 233);
});
