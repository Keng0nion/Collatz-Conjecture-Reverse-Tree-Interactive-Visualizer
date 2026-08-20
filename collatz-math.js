(function (root, factory) {
    const api = factory();
    if (typeof module === 'object' && module.exports) {
        module.exports = api;
    }
    root.CollatzMath = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
    'use strict';

    function assertPositiveSafeInteger(value, name = 'value') {
        if (!Number.isSafeInteger(value) || value < 1) {
            throw new RangeError(`${name} must be a positive safe integer`);
        }
    }

    function forwardCollatz(value) {
        assertPositiveSafeInteger(value);
        if (value === 1) return 1;
        const next = value % 2 === 0 ? value / 2 : (3 * value) + 1;
        if (!Number.isSafeInteger(next)) {
            throw new RangeError('Collatz step exceeds JavaScript safe-integer precision');
        }
        return next;
    }

    function reversePredecessors(value, options = {}) {
        assertPositiveSafeInteger(value);
        const pruneRootCycle = options.pruneRootCycle !== false;
        const doubled = value * 2;
        if (!Number.isSafeInteger(doubled)) {
            throw new RangeError('Reverse Collatz step exceeds JavaScript safe-integer precision');
        }

        const predecessors = [doubled];
        if ((value - 1) % 3 === 0) {
            const candidate = (value - 1) / 3;
            const isPrunedRootEdge = pruneRootCycle && value === 4 && candidate === 1;
            if (candidate > 0 && candidate % 2 === 1 && !isPrunedRootEdge) {
                predecessors.push(candidate);
            }
        }
        return predecessors;
    }

    function toMK(value) {
        assertPositiveSafeInteger(value);
        return {
            m: Math.floor(value / 6),
            k: value % 6
        };
    }

    function generateReverseTree(rootValue, maxDepth, options = {}) {
        assertPositiveSafeInteger(rootValue, 'rootValue');
        if (!Number.isInteger(maxDepth) || maxDepth < 0) {
            throw new RangeError('maxDepth must be a non-negative integer');
        }

        const stepsMap = new Map([[rootValue, 0]]);
        const parentMap = new Map([[rootValue, null]]);
        const queue = [rootValue];
        let queueIndex = 0;

        while (queueIndex < queue.length) {
            const current = queue[queueIndex++];
            const currentStep = stepsMap.get(current);
            if (currentStep >= maxDepth) continue;

            for (const predecessor of reversePredecessors(current, options)) {
                if (!stepsMap.has(predecessor)) {
                    stepsMap.set(predecessor, currentStep + 1);
                    parentMap.set(predecessor, current);
                    queue.push(predecessor);
                }
            }
        }

        return { stepsMap, parentMap };
    }

    function levelCounts(rootValue, maxDepth, options = {}) {
        const { stepsMap } = generateReverseTree(rootValue, maxDepth, options);
        const counts = Array(maxDepth + 1).fill(0);
        for (const depth of stepsMap.values()) counts[depth] += 1;
        return counts;
    }

    function largestPrimeFactor(value) {
        if (!Number.isSafeInteger(value) || value < 2) {
            throw new RangeError('value must be a safe integer greater than or equal to 2');
        }

        let remaining = value;
        let largest = 1;
        while (remaining % 2 === 0) {
            largest = 2;
            remaining /= 2;
        }
        for (let divisor = 3; divisor * divisor <= remaining; divisor += 2) {
            while (remaining % divisor === 0) {
                largest = divisor;
                remaining /= divisor;
            }
        }
        return Math.max(largest, remaining);
    }

    function next233(value) {
        const factor = largestPrimeFactor(value);
        return (factor * 10) + (factor % 10);
    }

    function find233Cycle(startValue = 233, maxIterations = 10000) {
        if (!Number.isInteger(maxIterations) || maxIterations < 1) {
            throw new RangeError('maxIterations must be a positive integer');
        }

        const sequence = [];
        const firstIndex = new Map();
        let current = startValue;
        while (!firstIndex.has(current)) {
            if (sequence.length >= maxIterations) {
                throw new Error(`No cycle found within ${maxIterations} iterations`);
            }
            firstIndex.set(current, sequence.length);
            sequence.push(current);
            current = next233(current);
        }

        const cycleStart = firstIndex.get(current);
        return {
            preperiod: sequence.slice(0, cycleStart),
            cycle: sequence.slice(cycleStart),
            repeatedValue: current
        };
    }

    return {
        forwardCollatz,
        reversePredecessors,
        toMK,
        generateReverseTree,
        levelCounts,
        largestPrimeFactor,
        next233,
        find233Cycle
    };
});
