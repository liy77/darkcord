const process = require("node:process");
const child = require("node:child_process");
const { performance } = require("node:perf_hooks");

let scriptFile;
if (process.platform === "win32") {
    scriptFile = "prepare.bat";
} else {
    scriptFile = "./prepare.sh";
}

const init = performance.now();
const prepare = child.spawn(scriptFile);

prepare.stderr.on("data", (chunk) => {
    console.log("\x1b[31merror\x1b[31m ->\n   " + chunk.toString())
});

let replaced = 0;
prepare.stdout.on("data", buffer => {
    const message = buffer.toString();

    if (message.includes("Compiling...")) {
        console.log("\033[34minfo\x1b[0m Compiling typescript files...");
    }

    if (message.includes("tscpaths")) {
        if (replaced === 2) {
            console.log("\033[34minfo\x1b[0m Resolving import maps in dist...");
        } else if (replaced === 1) {
            console.log("\033[34minfo\x1b[0m Resolving import maps in typings...");
        }

        replaced++
    }
});

prepare.on("exit", (code) => {
    const time = performance.now() - init;

    if (code === 0) {
        console.log("\x1b[32msuccess\x1b[0m Compiled in " + time.toFixed(2) + "ms");
    } else {
        console.log("\x1b[31merror\x1b[0m Failed to compile...\n\nProcess exited in " + time.toFixed(2) + "ms");
    }
})