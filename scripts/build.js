const { exec } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");
const { performance } = require("node:perf_hooks");

const specifiedPackages = process.argv.slice(2);

let packages = fs
  .readdirSync("./packages", {
    withFileTypes: true,
  })
  .filter((dirent) => dirent.isDirectory())
  .map((pkg) => pkg.name);

if (!specifiedPackages.every((pkg) => packages.includes(pkg))) {
  console.log(
    "\x1b[31merror\x1b[0m Package " +
      specifiedPackage +
      " not found in packages directory",
  );
  return;
} else {
  packages = specifiedPackages;
}

const init = performance.now();
function runBuild(script, pkg) {
  console.log("\033[34minfo\x1b[0m Building " + pkg + "...");

  console.log("\033[34minfo\x1b[0m Using script:", script);
  const pkgPath = path.join("packages", pkg);
  const distPath = path.join(pkgPath, "dist");
  const typingsPath = path.join(pkgPath, "typings");
  const isPreScript = script.includes("pre");

  if (fs.existsSync(distPath) && !isPreScript) {
    fs.rmSync(distPath, {
      recursive: true,
    });

    console.log("\033[34minfo\x1b[0m Deleted:", distPath);
  }

  if (fs.existsSync(typingsPath) && !isPreScript) {
    fs.rmSync(typingsPath, {
      recursive: true,
    });

    console.log("\033[34minfo\x1b[0m Deleted:", typingsPath);
  }

  const installDependencies = () =>
    new Promise((resolve) => {
      console.log("\033[34minfo\x1b[0m Installing dependencies...");
      exec("cd " + pkgPath + " && pnpm install")
        .on("exit", () => {
          console.log("\x1b[32msuccess\x1b[0m Installed all dependencies");
          resolve();
        })
        .stdout.on("data", (buffer) => {
          console.log(buffer.toString());
        });
    });

  return new Promise(async (resolve) => {
    await installDependencies();
    const process = exec("cd " + pkgPath + " && " + script);

    process
      .on("exit", (code) => {
        if (code === 0) {
          console.log("\x1b[32msuccess\x1b[0m Builded " + pkg);
          resolve(true);
        } else {
          console.log("\x1b[31merror\x1b[0m Error on build " + pkg);
          resolve(false);
        }
      })
      .stderr.on("data", (buffer) => {
        console.log(buffer.toString());
      });

    process.stdout.on("data", (buffer) => {
      console.log(buffer.toString());
    });
  });
}

async function build() {
  let buildedPackages = 0;
  for (const pkg of packages) {
    const packagesPath = process.cwd().endsWith("packages")
      ? process.cwd()
      : path.join(process.cwd(), "packages");
    const pkgJSON = require(require.resolve(
      path.join(packagesPath, pkg, "package.json"),
    ));

    let buildScript;
    if (pkgJSON.scripts && pkgJSON.scripts.pre) {
      buildScript = "pnpm run pre";
    } else {
      buildScript = "pnpm tsup";
    }

    const builded = await runBuild(buildScript, pkg);

    if (builded) {
      buildedPackages++;
    }
    console.log("---------------------------------------------------------");
  }

  console.log(
    "\x1b[32msuccess\x1b[0m Builded " +
      buildedPackages +
      " packages in " +
      (performance.now() - init).toFixed(2) +
      "ms",
  );
}

build();
