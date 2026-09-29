/*
==========================================================
ARGON2i PASSWORD HASHING - VIRTUAL CRYPTOGRAPHY LAB
==========================================================

Experiment:
Implementation of Argon2i password hashing and verification
and analysis of memory cost, time cost and parallelism.

The Argon2 browser library is loaded in index.html.

IMPORTANT:
This experiment uses:

    argon2.ArgonType.Argon2i

NOT Argon2id.
*/


// ======================================================
// GLOBAL VARIABLES
// ======================================================

let generatedHash = "";

let benchmarkNumber = 0;


// ======================================================
// HELPER FUNCTIONS
// ======================================================

function getMemoryInMB(memoryKiB) {

    return memoryKiB / 1024;

}


function getParameters() {

    return {

        memory:
            Number(
                document.getElementById("memory").value
            ),

        time:
            Number(
                document.getElementById("time").value
            ),

        parallelism:
            Number(
                document.getElementById("parallelism").value
            )

    };

}


function setStatus(element, message, type) {

    element.textContent = message;

    element.className =
        "status " + type;

}


// ======================================================
// SHOW / HIDE PASSWORD
// ======================================================

document
    .getElementById("showPassword")
    .addEventListener("change", function () {

        const passwordInput =
            document.getElementById("password");


        if (this.checked) {

            passwordInput.type = "text";

        } else {

            passwordInput.type = "password";

        }

    });


// ======================================================
// GENERATE ARGON2i HASH
// ======================================================

document
    .getElementById("hashBtn")
    .addEventListener("click", async function () {


        const password =
            document.getElementById("password").value;


        const status =
            document.getElementById("hashStatus");


        const button =
            document.getElementById("hashBtn");


        // ------------------------------
        // VALIDATE PASSWORD
        // ------------------------------

        if (!password) {

            setStatus(
                status,
                "Please enter a password first.",
                "error"
            );

            return;

        }


        // ------------------------------
        // GET PARAMETERS
        // ------------------------------

        const params =
            getParameters();


        // ------------------------------
        // DISABLE BUTTON
        // ------------------------------

        button.disabled = true;

        button.textContent =
            "Generating Argon2i Hash...";


        setStatus(
            status,
            "Argon2i is processing the password...",
            "neutral"
        );


        // ------------------------------
        // START TIMER
        // ------------------------------

        const startTime =
            performance.now();


        try {


            // --------------------------------------
            // GENERATE RANDOM SALT
            // --------------------------------------

            const salt =
                crypto.getRandomValues(
                    new Uint8Array(16)
                );


            // --------------------------------------
            // ARGON2i HASH
            // --------------------------------------

            const result =
                await argon2.hash({

                    pass: password,

                    salt: salt,

                    time: params.time,

                    mem: params.memory,

                    parallelism:
                        params.parallelism,

                    hashLen: 32,

                    /*
                    IMPORTANT:
                    This explicitly selects Argon2i.
                    */

                    type:
                        argon2.ArgonType.Argon2i

                });


            // ------------------------------
            // END TIMER
            // ------------------------------

            const endTime =
                performance.now();


            const elapsed =
                endTime - startTime;


            // ------------------------------
            // STORE HASH
            // ------------------------------

            generatedHash =
                result.encoded;


            // ------------------------------
            // DISPLAY HASH
            // ------------------------------

            document
                .getElementById("hashOutput")
                .value =
                result.encoded;


            // ------------------------------
            // DISPLAY TIME
            // ------------------------------

            document
                .getElementById("hashTime")
                .textContent =
                elapsed.toFixed(2) + " ms";


            // ------------------------------
            // DISPLAY PARAMETERS
            // ------------------------------

            document
                .getElementById("resultMemory")
                .textContent =
                getMemoryInMB(
                    params.memory
                ) + " MB";


            document
                .getElementById("resultTime")
                .textContent =
                params.time;


            document
                .getElementById("resultParallelism")
                .textContent =
                params.parallelism;


            // ------------------------------
            // SUCCESS
            // ------------------------------

            setStatus(
                status,
                "✓ Argon2i hash generated successfully.",
                "success"
            );


        } catch (error) {


            console.error(
                "Argon2i error:",
                error
            );


            setStatus(
                status,
                "Error while generating Argon2i hash: " +
                error.message,
                "error"
            );

        }


        // ------------------------------
        // ENABLE BUTTON
        // ------------------------------

        button.disabled = false;

        button.textContent =
            "Generate Argon2i Hash";

    });


// ======================================================
// PASSWORD VERIFICATION
// ======================================================

document
    .getElementById("verifyBtn")
    .addEventListener("click", async function () {


        const password =
            document
                .getElementById("verifyPassword")
                .value;


        const resultBox =
            document
                .getElementById("verifyResult");


        const button =
            document
                .getElementById("verifyBtn");


        // ------------------------------
        // CHECK HASH
        // ------------------------------

        if (!generatedHash) {

            setStatus(
                resultBox,
                "Generate an Argon2i hash before verification.",
                "error"
            );

            return;

        }


        // ------------------------------
        // CHECK PASSWORD
        // ------------------------------

        if (!password) {

            setStatus(
                resultBox,
                "Please enter a password for verification.",
                "error"
            );

            return;

        }


        button.disabled = true;

        button.textContent =
            "Verifying...";


        setStatus(
            resultBox,
            "Verifying password...",
            "neutral"
        );


        try {


            // --------------------------------------
            // VERIFY ARGON2i HASH
            // --------------------------------------

            await argon2.verify({

                pass: password,

                encoded: generatedHash

            });


            // --------------------------------------
            // SUCCESS
            // --------------------------------------

            setStatus(
                resultBox,
                "✓ Password Verified — the entered password matches the Argon2i hash.",
                "success"
            );


        } catch (error) {


            // --------------------------------------
            // FAILURE
            // --------------------------------------

            setStatus(
                resultBox,
                "✗ Verification Failed — the entered password does not match the Argon2i hash.",
                "error"
            );

        }


        button.disabled = false;

        button.textContent =
            "Verify Password";

    });

// --------------------------------------------------
// BENCHMARK
// --------------------------------------------------

document.getElementById("benchmarkBtn").addEventListener("click", async function () {

    const password =
        document.getElementById("password").value ||
        "VirtualLabPassword123";


    const memory =
        Number(document.getElementById("analysisMemory").value);


    const time =
        Number(document.getElementById("analysisTime").value);


    const parallelism =
        Number(document.getElementById("analysisParallelism").value);


    const status =
        document.getElementById("benchmarkStatus");


    const button =
        document.getElementById("benchmarkBtn");


    button.disabled = true;

    button.textContent = "Running Benchmark...";


    setStatus(
        status,
        "Benchmark is running. Please wait...",
        "neutral"
    );


    try {

        const salt = crypto.getRandomValues(
            new Uint8Array(16)
        );


        const startTime = performance.now();


        await argon2.hash({

            pass: password,

            salt: salt,

            time: time,

            mem: memory,

            parallelism: parallelism,

            hashLen: 32,

            type: argon2.ArgonType.Argon2id

        });


        const endTime = performance.now();

        const elapsed =
            endTime - startTime;


        addBenchmarkResult(
            memory,
            time,
            parallelism,
            elapsed
        );


        updateObservations();


        setStatus(
            status,
            "✓ Benchmark completed successfully.",
            "success"
        );


    } catch (error) {

        console.error(error);

        setStatus(
            status,
            "Benchmark error: " + error.message,
            "error"
        );

    }


    button.disabled = false;
    button.textContent = "Run Benchmark";

});


// --------------------------------------------------
// ADD BENCHMARK RESULT
// --------------------------------------------------


function addBenchmarkResult(
    memory,
    time,
    parallelism,
    elapsed
) {

    benchmarkNumber++;


    const table =
        document.getElementById("resultsTable");


    const row =
        document.createElement("tr");


    row.innerHTML = `

        <td>${benchmarkNumber}</td>

        <td>${getMemoryInMB(memory)} MB</td>

        <td>${time}</td>

        <td>${parallelism}</td>

        <td>${elapsed.toFixed(2)} ms</td>

    `;


    table.appendChild(row);

}


// --------------------------------------------------
// OBSERVATIONS
// --------------------------------------------------

function updateObservations() {

    const memory =
        Number(document.getElementById("analysisMemory").value);


    const time =
        Number(document.getElementById("analysisTime").value);


    const parallelism =
        Number(document.getElementById("analysisParallelism").value);


    const observation =
        document.getElementById("observations");


    observation.innerHTML = `

        <strong>Current configuration:</strong>

        ${getMemoryInMB(memory)} MB memory,
        time cost ${time},
        parallelism ${parallelism}.

        <br><br>

        <strong>Observation:</strong>

        Increasing memory cost generally increases the amount
        of memory required by the hashing operation.

        Increasing time cost generally increases computational
        work and therefore hashing time.

        Changing parallelism can affect execution time and
        resource usage depending on the environment.

        <br><br>

        <strong>Note:</strong>

        Actual execution times depend on the computer,
        browser, CPU, available memory and other running
        processes.
    `;

}


// --------------------------------------------------
// QUIZ
// --------------------------------------------------

document.getElementById("quizBtn").addEventListener("click", function () {

    const answers = {
        q1: "b",
        q2: "c",
        q3: "b",
        q4: "a",
        q5: "c"
    };

    const explanations = {

        q1: "Correct. A different random salt normally produces a different Argon2i hash even when the password is the same.",

        q2: "Correct. Increasing memory cost increases the amount of memory required during the Argon2i computation.",

        q3: "Correct. An incorrect password should fail verification against the stored Argon2i hash.",

        q4: "Correct. m=65536 means 65536 KiB of memory, t=3 is the time cost, and p=2 is the parallelism.",

        q5: "Correct. Increasing the time cost increases the computational work performed by Argon2i."
    };


    let score = 0;

    const total = 5;


    // Remove previous validation messages
    document.querySelectorAll(".quiz-feedback").forEach(function (element) {
        element.remove();
    });


    // Reset previous styles
    document.querySelectorAll(".quiz-question").forEach(function (question) {

        question.style.border = "1px solid #E5D4CB";
        question.style.background = "#FFF8F5";

    });


    // Check every question
    for (const question in answers) {

        const questionBox =
            document.querySelector(
                `input[name="${question}"]`
            ).closest(".quiz-question");


        const selected =
            document.querySelector(
                `input[name="${question}"]:checked`
            );


        const feedback =
            document.createElement("div");


        feedback.className =
            "quiz-feedback";


        // ----------------------------------------
        // NO ANSWER SELECTED
        // ----------------------------------------

        if (!selected) {

            feedback.innerHTML =
                `
                <strong>⚠ No answer selected.</strong><br>
                Please select an option.
                `;

            feedback.style.background = "#FFF4DE";
            feedback.style.color = "#805A24";
            feedback.style.border = "1px solid #E8D09A";

            questionBox.style.border =
                "1px solid #E8D09A";


            questionBox.appendChild(feedback);

            continue;
        }


        // ----------------------------------------
        // CORRECT ANSWER
        // ----------------------------------------

        if (selected.value === answers[question]) {

            score++;


            feedback.innerHTML =
                `
                <strong>✓ Correct!</strong><br>
                ${explanations[question]}
                `;

            feedback.style.background =
                "#DCFCE7";

            feedback.style.color =
                "#166534";

            feedback.style.border =
                "1px solid #86EFAC";


            questionBox.style.border =
                "2px solid #86EFAC";

            questionBox.style.background =
                "#F0FDF4";

        }


        // ----------------------------------------
        // INCORRECT ANSWER
        // ----------------------------------------

        else {

            const correctOption =
                document.querySelector(
                    `input[name="${question}"][value="${answers[question]}"]`
                );


            let correctText = "";


            if (correctOption) {

                correctText =
                    correctOption.parentElement.textContent.trim();

            }


            feedback.innerHTML =
                `
                <strong>✗ Incorrect.</strong><br>
                Correct answer: <strong>${correctText}</strong>
                `;


            feedback.style.background =
                "#FEE2E2";

            feedback.style.color =
                "#991B1B";

            feedback.style.border =
                "1px solid #FCA5A5";


            questionBox.style.border =
                "2px solid #FCA5A5";

            questionBox.style.background =
                "#FEF2F2";

        }


        questionBox.appendChild(feedback);

    }


    // ----------------------------------------
    // CALCULATE SCORE
    // ----------------------------------------

    const percentage =
        Math.round(
            (score / total) * 100
        );


    const result =
        document.getElementById("quizResult");


    // ----------------------------------------
    // DISPLAY RESULT
    // ----------------------------------------

    if (score === total) {

        result.innerHTML =
            `
            <strong>Excellent!</strong><br>
            Your Score: ${score}/${total}
            (${percentage}%)
            <br><br>
            All answers are correct. You have demonstrated
            a strong understanding of Argon2i.
            `;

        result.style.background =
            "#DCFCE7";

        result.style.color =
            "#166534";

        result.style.border =
            "1px solid #86EFAC";

    }

    else if (score >= 3) {

        result.innerHTML =
            `
            <strong>Good Attempt!</strong><br>
            Your Score: ${score}/${total}
            (${percentage}%)
            <br><br>
            Review the questions marked incorrect
            and revisit the Argon2i theory section.
            `;

        result.style.background =
            "#FEF3C7";

        result.style.color =
            "#92400E";

        result.style.border =
            "1px solid #FCD34D";

    }

    else {

        result.innerHTML =
            `
            <strong>Needs Improvement.</strong><br>
            Your Score: ${score}/${total}
            (${percentage}%)
            <br><br>
            Review the Argon2i concepts, parameters,
            salt generation, and verification procedure
            before attempting the quiz again.
            `;

        result.style.background =
            "#FEE2E2";

        result.style.color =
            "#991B1B";

        result.style.border =
            "1px solid #FCA5A5";

    }


    // ----------------------------------------
    // SCROLL TO RESULT
    // ----------------------------------------

    result.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

});


// --------------------------------------------------
// FEEDBACK
// --------------------------------------------------

document.getElementById("feedbackBtn").addEventListener("click", function () {

    const selected =
        document.querySelector(
            'input[name="rating"]:checked'
        );


    const feedback =
        document.getElementById("feedbackText").value;


    const result =
        document.getElementById("feedbackResult");


    if (!selected) {

        result.textContent =
            "Please select a rating.";

        result.style.color = "#b91c1c";

        return;

    }


    result.textContent =
        "✓ Thank you for your feedback!";


    result.style.color = "#166534";


    console.log({

        rating: selected.value,

        feedback: feedback

    });

});