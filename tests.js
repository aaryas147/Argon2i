/*
=========================================================
ARGON2i LAB - AUTOMATED TEST SUITE
=========================================================

Loads after script.js and exercises the real logic:
hashing, salt behaviour, verification, quiz and
benchmark. Open tests.html to run.
*/

// --------------------------------------------------
// TEST RECORDER
// --------------------------------------------------

const testResults = [];

function record(name, pass, note) {

    testResults.push({ name, pass, note });

    const row = document.createElement("tr");

    row.innerHTML =
        "<td>" + testResults.length + "</td>" +
        "<td>" + name + "</td>" +
        "<td>" + (pass ? "Pass" : "FAIL") + "</td>" +
        "<td>" + (note || "") + "</td>";

    document.getElementById("testsTable").appendChild(row);
}


function finish() {

    const failed = testResults.filter(t => !t.pass).length;

    const summary = document.getElementById("testSummary");

    summary.textContent =
        testResults.length + " tests run, " +
        (testResults.length - failed) + " passed, " +
        failed + " failed.";

    summary.className = failed === 0
        ? "status success"
        : "status error";
}

const TEST_PASS = "VirtualLabPassword123";

async function testGetMemoryInMB() {
    const a = getMemoryInMB(65536) === 64;
    const b = getMemoryInMB(16384) === 16;
    return { pass: a && b, note: "65536 KiB -> 64 MB, 16384 KiB -> 16 MB" };
}

async function testHashPrefix() {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const r = await argon2.hash({
        pass: TEST_PASS, salt: salt, time: 1, mem: 1024,
        parallelism: 1, hashLen: 32, type: argon2.ArgonType.Argon2i
    });
    const ok = r.encoded.startsWith("$argon2i$v=19$");
    return { pass: ok, note: r.encoded.slice(0, 34) + "..." };
}

async function testSaltUniqueness() {
    const make = () => argon2.hash({
        pass: TEST_PASS, salt: crypto.getRandomValues(new Uint8Array(16)),
        time: 1, mem: 1024, parallelism: 1, hashLen: 32,
        type: argon2.ArgonType.Argon2i
    });
    const h1 = (await make()).encoded;
    const h2 = (await make()).encoded;
    return { pass: h1 !== h2, note: "same password, fresh salts -> different hashes" };
}

async function testDeterminism() {
    const salt = new Uint8Array(16).fill(7);
    const opts = { pass: TEST_PASS, salt, time: 1, mem: 1024,
        parallelism: 1, hashLen: 32, type: argon2.ArgonType.Argon2i };
    const h1 = (await argon2.hash(opts)).encoded;
    const h2 = (await argon2.hash(opts)).encoded;
    return { pass: h1 === h2, note: "same password + salt + params -> identical hash" };
}

async function testVerifyCorrect() {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const r = await argon2.hash({
        pass: TEST_PASS, salt: salt, time: 1, mem: 1024,
        parallelism: 1, hashLen: 32, type: argon2.ArgonType.Argon2i
    });
    await argon2.verify({ pass: TEST_PASS, encoded: r.encoded });
    const box = document.getElementById("verifyResult");
    return { pass: true, note: "argon2.verify resolved for correct password" };
}

async function testVerifyWrong() {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const r = await argon2.hash({
        pass: TEST_PASS, salt: salt, time: 1, mem: 1024,
        parallelism: 1, hashLen: 32, type: argon2.ArgonType.Argon2i
    });
    let rejected = false;
    try {
        await argon2.verify({ pass: "WrongPassword!", encoded: r.encoded });
    } catch (e) {
        rejected = true;
    }
    return { pass: rejected, note: "argon2.verify rejected for wrong password" };
}

// --------------------------------------------------
// QUIZ MECHANICS TESTS
// --------------------------------------------------

const QUIZ_ANSWERS = {
    q1: "b", q2: "c", q3: "b", q4: "a", q5: "c",
    q6: "b", q7: "c", q8: "b", q9: "b", q10: "a"
};

function click(el) { el.click(); }

async function testQuizEmpty() {
    document.querySelectorAll('.quiz-question input[type="radio"]').forEach(r => r.checked = false);
    click(document.getElementById("quizBtn"));
    const result = document.getElementById("quizResult").textContent;
    const warnings = document.querySelectorAll(".quiz-feedback").length;
    const ok = result.includes("0/10") && warnings === 10;
    return { pass: ok, note: warnings + " warnings, score 0/10" };
}

async function testQuizAllCorrect() {
    for (const q in QUIZ_ANSWERS) {
        const input = document.querySelector('input[name="' + q + '"][value="' + QUIZ_ANSWERS[q] + '"]');
        input.checked = true;
    }
    click(document.getElementById("quizBtn"));
    const result = document.getElementById("quizResult").textContent;
    const ok = result.includes("10/10") && result.includes("Excellent");
    return { pass: ok, note: result.trim().split("\n")[0] || "score block rendered" };
}

async function testRetakeClears() {
    click(document.getElementById("quizResetBtn"));
    const unchecked = document.querySelectorAll('.quiz-question input[type="radio"]:checked').length;
    const feedback = document.querySelectorAll(".quiz-feedback").length;
    const empty = document.getElementById("quizResult").textContent.trim() === "";
    const ok = unchecked === 0 && feedback === 0 && empty;
    return { pass: ok, note: "radios, feedback and result cleared" };
}

// --------------------------------------------------
// BENCHMARK TEST
// --------------------------------------------------

async function testBenchmarkRow() {
    document.getElementById("memory").value = "16384";
    document.getElementById("time").value = "1";
    document.getElementById("parallelism").value = "1";
    document.getElementById("analysisMemory").value = "16384";
    document.getElementById("analysisTime").value = "1";
    document.getElementById("analysisParallelism").value = "1";
    click(document.getElementById("benchmarkBtn"));
    // wait for the async benchmark to finish
    await new Promise(resolve => setTimeout(resolve, 1500));
    const rows = document.querySelectorAll("#resultsTable tr").length;
    const ok = rows >= 1;
    return { pass: ok, note: rows + " benchmark row(s) recorded" };
}

// --------------------------------------------------
// RUNNER
// --------------------------------------------------

const TESTS = [
    ["getMemoryInMB conversion", testGetMemoryInMB],
    ["Argon2i encoded-hash prefix", testHashPrefix],
    ["Salt uniqueness", testSaltUniqueness],
    ["Determinism (same salt)", testDeterminism],
    ["Verify correct password", testVerifyCorrect],
    ["Verify wrong password", testVerifyWrong],
    ["Quiz empty submit", testQuizEmpty],
    ["Quiz all correct", testQuizAllCorrect],
    ["Retake clears state", testRetakeClears],
    ["Benchmark adds row", testBenchmarkRow]
];

document.getElementById("runTestsBtn").addEventListener("click", async function () {

    const button = this;

    button.disabled = true;

    document.getElementById("testsTable").innerHTML = "";

    testResults.length = 0;

    let failed = 0;

    for (const [name, fn] of TESTS) {

        let outcome;

        try {
            outcome = await fn();
        } catch (e) {
            outcome = { pass: false, note: "threw: " + (e.message || e) };
        }

        record(name, outcome.pass, outcome.note);

        if (!outcome.pass) failed++;
    }

    finish(failed);
});
