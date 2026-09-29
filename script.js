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

