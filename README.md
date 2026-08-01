# Collatz-Conjecture-Reverse-Tree-Interactive-Visualizer
An interactive visualizer for the reverse Collatz tree from root 1. Adjustable depth, click nodes to show forward paths. Toggle between raw numbers and (m,k) coordinates (m=floor(n/6), k=n mod 6). Export full graph as HD PNG. Runs client-side.
# Iterative Properties of Largest Prime Factor Sequences — The 233 Conjecture & the Collatz Conjecture

> **IB Mathematics Analysis and Approaches (HL) — Internal Assessment**

An interactive visualization tool and mathematical investigation into the iterative structures of the 233 Conjecture and the Collatz Conjecture, exploring their shared convergence properties through reverse-tree analysis and modular arithmetic isomorphism proofs.

---

## Overview

This project originated from an observation: the **233 Conjecture** — a lesser-known number-theory conjecture popular in Chinese online communities — bears striking structural similarity to the famous **Collatz Conjecture**, yet uses a simpler single-path iteration without parity-based branching. By studying the easier-to-compute 233 Conjecture first, can we uncover new iterative properties that shed light on the far more complex Collatz Conjecture?

### Research Questions

1. By taking the 233 Conjecture — a number theory conjecture with a simpler, single-path iterative structure that avoids parity-based branching — as our entry point, what previously unexamined iterative properties of the Collatz Conjecture can we identify?

2. Do the iterative properties identified through this approach carry substantive, meaningful value for advancing the rigorous proof of the Collatz Conjecture?

---

## Background

### The Collatz Conjecture

For any positive integer *x*, repeatedly apply:

- If *x* is odd: **f(x) = 3x + 1**
- If *x* is even: **f(x) = x / 2**

The conjecture states that every positive integer will eventually reach **1**.

### The 233 Conjecture

For any integer *n ≥ 2*, define:

**f(n) = LPF(n) × 10 + (LPF(n) mod 10)**

where `LPF(n)` is the **largest prime factor** of *n*.

The conjecture states that repeated iteration always enters a **21-step cycle** anchored at **233**:

```
233 → 2333 → 23333 → … → 8577 → 9533 → 233 → …
```

---

## Key Findings

### 1. Convergence Patterns in the 233 Conjecture

By constructing an iterative tree for the 233 Conjecture (primes 2 ≤ n ≤ 50), we observed that:

- All numbers (except 23) converge into two main iterative pathways initiated by **11** and **13**
- As the target range expands to 10⁹, the probability of entering non-11/13 pathways **first increases (peaking around 10³) then gradually decreases toward zero**
- New secondary pathways emerge through numbers like 112999, 1311, and 2277

### 2. Reverse Iteration (Backtracking) Equations

Derived the backtracking formula for both conjectures:

**233 Conjecture backtrack:**
```
LPF(c) = (a − (a mod 10)) / 10
```
where *a* is the current value and *c* is a predecessor.

**Collatz Conjecture backtrack:**
- **Equation 1 (always valid):** n → **2n**
- **Equation 2 (conditionally valid):** n → **(n−1) / 3** (only when n ≡ 1 mod 3 and (n−1)/3 is odd)

### 3. Multiples of 3 Have No Odd Predecessors

**Proven:** Any positive integer that is a multiple of 3 has **no odd predecessor** in the Collatz reverse iteration. Its only valid predecessor is the even predecessor 2n.

```
If n = 3k, then (n−1)/3 = k − 1/3 ∉ ℤ⁺  →  no odd predecessor exists.
```

### 4. Isomorphism of T5 and T32 Subtrees

**Novel finding:** In the reverse Collatz tree rooted at 1, the node **16** is the first node with two predecessors (32 and 5). The two reverse subtrees rooted at **5** and **32** are **structurally isomorphic** — identical in shape.

**Proof sketch (by induction):**
- A node *n* **forks** (has two predecessors) **if and only if** n ≡ 4 (mod 6)
- By induction, all corresponding nodes in T5 and T32 satisfy: **x ≡ f(x) (mod 6)**
- Therefore, corresponding nodes always fork (or not) simultaneously → identical tree shape

### 5. (m, k) Coordinate System

Introduced a coordinate representation where for any integer n:

```
m = ⌊n / 6⌋    k = n mod 6
```

This simplifies tracking how remainders evolve through reverse iteration, revealing patterns in how forking propagates through the tree.

---

## Interactive Visualization Tool

This repository includes `Collatz_reverse_tree.html` — a fully interactive web-based visualizer for the Collatz reverse iteration tree.

### Features

| Feature | Description |
|---------|-------------|
| 🔢 **Adjustable Depth** | Set max steps (1–12) to control tree size |
| 🔄 **(m,k) Toggle** | Switch between raw number display and (m, k) coordinate mode |
| 📸 **PNG Export** | Export the full tree as a high-resolution PNG image |
| 🖱️ **Interactive Navigation** | Scroll to zoom, drag to pan, click nodes for details |
| 🎨 **Color-coded Levels** | Nodes colored by their distance from root (1) |

### Usage

1. Open `Collatz_reverse_tree.html` in any modern web browser
2. Adjust the **Max steps** slider and click **Generate / Refresh Tree**
3. Click **Toggle (m,k) Coordinates** to switch display modes
4. Click **Export HD PNG** to save a snapshot
5. Click any node to highlight its path back to the root

### Technology Stack

- **vis-network** (v9.1.6) — graph visualization library
- **Vanilla JavaScript** — BFS tree generation, modular arithmetic
- **HTML5 Canvas** — PNG export via canvas merging
- **No build step required** — just open the HTML file

---

## File Structure

```
├── Collatz_reverse_tree.html   # Interactive reverse Collatz tree visualizer
├── README.md                   # This file
└── (IA paper)                  # Full mathematical investigation (separate document)
```

---

## Mathematical Definitions

### Largest Prime Factor (LPF)

```
LPF(n) = max { p | p is prime and p | n }
```
If *n* is prime, LPF(n) = n.

### Forking Condition

A node *n* in the reverse Collatz tree **forks** (has exactly 2 predecessors) iff:

```
n ≡ 4 (mod 6)
```

**Sufficiency:** If n = 6k+4, then n−1 = 6k+3 = 3(2k+1), so (n−1)/3 = 2k+1 is an odd integer → odd predecessor exists. Even predecessor 2n always exists.

**Necessity:** If n forks, its odd predecessor requires n ≡ 1 (mod 3) and (n−1)/3 odd → (n−1)/3 = 2k+1 → n = 6k+4.

### (m, k) Backtracking Rules

For a node n = 6t + l:

**No fork (l ≠ 4):** only predecessor is 2n
- If l < 3: (2t, 2l)
- If l ≥ 3: (2t + ⌊l/3⌋, 2(l mod 3))

**Fork (l = 4):** two predecessors
- Even path: 2n → (2t+1, 2)
- Odd path: (n−1)/3 → (2t+1, 1)

---

## References

[1] Chinese BBS online community discussion (initial encounter with the 233 Conjecture)

[2] Andrei, S., & Kudlek, M. *Some results on the Collatz problem.*

[3] Lagarias, J. C. *The 3x+1 problem and its generalizations.* American Mathematical Monthly, 92(1), 3-23.

---

## License

This project is part of an IB Mathematics Internal Assessment. The visualization tool is provided for educational and research purposes.

---

*Built as part of IB Math AA HL Internal Assessment — Iterative Properties of Largest Prime Factor Sequences*
