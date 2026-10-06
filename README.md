# Argon2i Password Hashing: Virtual Lab

An interactive, browser-based experiment on **Argon2i**, the data-independent variant of the Argon2 password hashing function. Part of the **Virtual Cryptography Laboratory** for the *Cryptographic Security Systems (CSS)* course.

Students can generate Argon2i hashes, verify passwords, and measure how memory cost, time cost and parallelism change the hashing time. Everything runs locally in the browser, and no password is ever sent to a server.

## Live demo

Try the lab online at <https://argon2.lebronpereira.in>.

---

## Aim

To implement Argon2i password hashing and verification, and to analyze the effect of memory cost, time cost and parallelism on hashing.

## Features

- **Theory:** background on password hashing, memory-hardness, Argon2 variants, parameters, the algorithm steps, and how to read an encoded hash.
- **Procedure:** step-by-step instructions for performing the experiment.
- **Interactive experiment:** generate an Argon2i hash with a chosen memory cost, time cost and parallelism, and see the encoded hash and the hashing time.
- **Password verification:** check whether a password matches the generated hash.
- **Parameter analysis:** run benchmarks with different settings and compare execution times.
- **Test cases:** documented test cases (TC01–TC12) covering hashing, verification, parameter analysis and the quiz, with expected and actual results.
- **Automated test suite:** `tests.html` runs ten automated checks against the real experiment logic (hash format, salt uniqueness, determinism, verification, quiz mechanics and the benchmark).
- **Assessment and quiz:** a ten-question quiz with per-question feedback, scoring and a retake option.
- **References and feedback** sections.

## Tech stack

| Part | Technology |
| --- | --- |
| Structure | HTML5 |
| Styling | CSS3 |
| Logic | Vanilla JavaScript |
| Hashing | [argon2-browser](https://github.com/antelle/argon2-browser) v1.18.0 (WebAssembly), loaded from the jsDelivr CDN |

There is no backend and no build step.

## Project structure

```
Argon2i/
├── index.html   # Page structure and content (theory, experiment, test cases, quiz, etc.)
├── style.css    # Styling and layout
├── script.js    # Hashing, verification, benchmark and quiz logic
├── tests.html   # Automated test suite runner
├── tests.js     # Automated test cases
├── assets/CSS.mp4 # Embedded theory lesson video
└── README.md
```

## Getting started

### Prerequisites

- A modern browser (Chrome, Firefox, Edge or Safari)
- An internet connection (the Argon2 library is loaded from a CDN)
- Optional: Python 3, to run a local server

### Run locally

```bash
git clone https://github.com/aaryas147/Argon2i.git
cd Argon2i
python3 -m http.server 8000
```

On Windows, use `py -m http.server 8000`. Then open <http://localhost:8000> in your browser.

You can also open `index.html` directly, but a local server is more reliable.

## How to use the lab

1. Enter a password in the experiment section.
2. Choose the memory cost, time cost and parallelism.
3. Click **Generate Argon2i Hash** and note the encoded hash and the time taken.
4. Enter the password in the verification section and click **Verify Password**.
5. Change one parameter at a time and run the benchmark in the analysis section.
6. Compare the execution times and read the observations.
7. Attempt the quiz.
8. Optionally open `tests.html` and click **Run All Tests** to see the automated test suite pass.

## Understanding the parameters

| Parameter | Meaning | Effect when increased |
| --- | --- | --- |
| Memory cost (m) | RAM used, in KiB | More memory per guess, so attacks cost more |
| Time cost (t) | Number of passes over memory | Longer computation |
| Parallelism (p) | Number of lanes | Work is split across lanes and threads |

An encoded hash looks like this:

```
$argon2i$v=19$m=65536,t=3,p=2$<salt>$<hash>
```

Here `m=65536, t=3, p=2` means 65536 KiB (64 MiB) of memory, 3 passes and 2 lanes.

## Integration note

This repository is the standalone version of the experiment. It will be adapted into the shared Virtual Cryptography Laboratory portal, which uses the Theory, Procedure, Simulation and Quiz tab layout.

## Team

- Aarya
- Disha
- Chris
- Lebron

## References

- A. Biryukov, D. Dinu, D. Khovratovich, *Argon2: the memory-hard function for password hashing and other applications*
- [RFC 9106: Argon2 Memory-Hard Function for Password Hashing and Proof-of-Work Applications](https://www.rfc-editor.org/rfc/rfc9106)
- [Password Hashing Competition](https://www.password-hashing.net/)
- [argon2-browser](https://github.com/antelle/argon2-browser)
