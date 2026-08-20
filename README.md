# Collatz Reverse Tree Interactive Visualizer

An interactive browser visualizer for the **cycle-pruned reverse Collatz tree** rooted at `1`. It supports adjustable depth, raw-number and `(m,k)` labels, forward-trajectory inspection, and PNG export of the fitted viewport.

> **Correctness note:** An earlier version of this README incorrectly claimed that the reverse subtrees rooted at `5` and `32` were isomorphic, described the recurrence below as having a 21-step cycle, and gave an incorrect `(m,k)` formula for an odd predecessor. Those claims are corrected here and covered by automated tests.

## What the project does

`Collatz reverse tree.html` builds a breadth-first reverse tree from `1` using the ordinary, unaccelerated Collatz map

\[
C(x)=
\begin{cases}
3x+1, & x\text{ odd},\\
x/2, & x\text{ even}.
\end{cases}
\]

For a current value `n`, the possible reverse predecessors are:

1. `2n`, which is always valid;
2. `(n-1)/3`, when it is a positive odd integer.

The visualizer deliberately omits the reverse edge from `4` to `1`. Without this exception, the reverse structure contains the familiar cycle `1 → 4 → 2 → 1` and is not a rooted tree. The page therefore displays a **cycle-pruned rooted tree**, not the complete reverse directed graph.

### Features

- Generate the cycle-pruned reverse tree to a selected depth.
- Switch labels between `n` and `(m,k)`, where
  \[
  m=\lfloor n/6\rfloor,\qquad k=n\bmod 6.
  \]
- Click a node to display its actual forward Collatz trajectory back to `1`.
- Highlight the nodes and edges in that trajectory.
- Export the graph after fitting it into the current canvas viewport.

## Mathematical facts used by the visualizer

### Odd-predecessor and forking condition

An odd reverse predecessor exists exactly when

\[
\frac{n-1}{3}=2q+1
\]

for some non-negative integer `q`. Rearranging gives

\[
n=6q+4,
\]

so, in the complete reverse graph,

\[
n\text{ has an odd predecessor}\iff n\equiv4\pmod 6.
\]

Every positive integer also has the even predecessor `2n`. Therefore a node has two reverse predecessors exactly when `n ≡ 4 (mod 6)`.

There is one display-specific exception: at `n=4`, the odd predecessor is `1`, and that edge is omitted to break the root cycle. Thus node `4` has only one displayed child in this cycle-pruned tree.

### Multiples of 3

If `n=3q`, then

\[
\frac{n-1}{3}=q-\frac13
\]

is not an integer. A multiple of `3` therefore has no odd reverse predecessor.

### Correct `(m,k)` reverse rules

Write

\[
n=6m+k,\qquad 0\le k<6.
\]

For the always-valid even predecessor,

\[
2n=12m+2k,
\]

so its coordinates are

\[
\left(2m+\left\lfloor\frac{k}{3}\right\rfloor,\;2k\bmod6\right).
\]

An odd predecessor exists only for `k=4`. In that case,

\[
\frac{n-1}{3}=2m+1.
\]

Its `(m,k)` coordinates must be computed from the resulting integer:

\[
\left(
\left\lfloor\frac{2m+1}{6}\right\rfloor,
(2m+1)\bmod6
\right).
\]

Equivalently, if `m=3q+r` with `r∈{0,1,2}`, the odd predecessor has coordinates

\[
(q,2r+1).
\]

For example, `16=6·2+4` has odd predecessor `5`, whose coordinates are `(0,5)`.

## Correction: the subtrees rooted at 5 and 32 are not isomorphic

The earlier README inferred infinite structural isomorphism from a finite-depth visual similarity. That inference was false.

Apply the same reverse-branch word `EEEOEEOEO`, where `E(x)=2x` and `O(x)=(x-1)/3` when valid:

```text
5  → 10 → 20 → 40 → 13 → 26 → 52  → 17  → 34  → 11
32 → 64 → 128 → 256 → 85 → 170 → 340 → 113 → 226 → 75
```

The corresponding values `11` and `75` are not congruent modulo `6`:

```text
11 ≡ 5 (mod 6)
75 ≡ 3 (mod 6)
```

After one more even reverse step, they become `22` and `150`:

```text
22  ≡ 4 (mod 6)  → has an odd predecessor and forks
150 ≡ 0 (mod 6)  → has no odd predecessor
```

Accordingly, the level counts of the two rooted reverse trees first differ at depth 11:

| Depth from subtree root | `T5` nodes | `T32` nodes |
|---:|---:|---:|
| 9 | 9 | 9 |
| 10 | 12 | 12 |
| 11 | 15 | 14 |
| 12 | 19 | 17 |

This counterexample disproves the former isomorphism claim. It also illustrates why finite visual agreement and modulo-6 observations are insufficient to establish an infinite tree isomorphism.

## Correction: largest-prime-factor recurrence and the 233 cycle

The associated investigation considered the recurrence

\[
F(n)=10\operatorname{LPF}(n)+(\operatorname{LPF}(n)\bmod10),
\]

where `LPF(n)` is the largest prime factor of `n`.

Under this exact definition, the orbit starting at `233` is a **26-state cycle**, not a 21-step cycle:

```text
233 → 2333 → 23333 → 233333 → 6611 → 6011 → 60111
→ 66799 → 9977 → 9077 → 3133 → 2411 → 24111 → 477
→ 533 → 411 → 1377 → 177 → 599 → 5999 → 8577 → 9533
→ 95333 → 136199 → 194577 → 8211 → 233
```

In particular, `9533` is prime, so

\[
F(9533)=10·9533+3=95333,
\]

not `233`.

This repository verifies the cycle above, but it **does not claim or prove that every starting integer enters this cycle**. Earlier unsupported statements about experiments up to `10^9` and pathway probabilities have been removed because the corresponding data and reproducible analysis were not present in the repository.

## Usage

1. Download or clone the repository.
2. Open `Collatz reverse tree.html` in a modern browser with internet access. The page currently loads `vis-network` from a version-pinned CDN.
3. Enter a depth and click **Generate / Refresh Tree**.
4. Toggle `(m,k)` labels if desired.
5. Click a node to inspect and highlight its forward trajectory to `1`.
6. Click **Export PNG (Fitted View)** to save the graph as currently fitted into the canvas.

The depth input is limited to `30`. With the current cycle-pruned generator, depth `8` has `17` nodes, depth `12` has `47` nodes, and depth `27` has `1,748` nodes.

## Automated verification

The mathematical core is in `collatz-math.js`, which is shared by the browser page and the Node.js tests.

Run:

```bash
node --test tests/collatz-math.test.js
```

The tests check:

- every generated reverse edge maps back under the forward Collatz rule;
- the special root-cycle pruning convention;
- `(m,k)` round trips and the corrected odd-predecessor example;
- known node counts at selected depths;
- the explicit counterexample to `T5 ≅ T32`;
- the complete 26-state cycle under the stated largest-prime-factor recurrence.

## Repository structure

```text
├── Collatz reverse tree.html   # Interactive visualizer
├── collatz-math.js             # Shared mathematical core
├── tests/
│   └── collatz-math.test.js    # Automated mathematical checks
└── README.md
```

## Limitations

- The Collatz conjecture remains unproved; this visualizer is not a proof.
- The visualizer shows a finite, cycle-pruned tree and cannot justify claims about infinite subtree equivalence from appearance alone.
- JavaScript `Number` arithmetic is exact only for integers up to `2^53-1`; the UI depth cap keeps the current root-1 tree within that range, but any future extension should preserve explicit safe-integer checks.
- PNG export captures the fitted canvas viewport; it is not an arbitrarily scalable full-graph renderer.
- `vis-network` is loaded from the internet, so the page is not yet fully offline.

## References

- Lagarias, J. C. (1985). *The 3x + 1 problem and its generalizations*. American Mathematical Monthly, 92(1), 3–23.
- Andrei, S., & Kudlek, M. *Some results on the Collatz problem*.

## Research-integrity note

The purpose of these corrections is to distinguish proven facts, computational observations, disproved conjectures, and open questions. Finding a counterexample to an earlier conjecture is part of the mathematical process and is more informative than retaining a claim contradicted by computation.
