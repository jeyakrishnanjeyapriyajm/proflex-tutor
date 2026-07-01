const fs = require("fs");
const path = require("path");
const { execFile } = require("child_process");
const crypto = require("crypto");

const TEMP_DIR = path.join(__dirname, "..", "temp");

const ensureTempDir = () => {
  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
  }
};

const cleanupFiles = (files = []) => {
  files.forEach((file) => {
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
    }
  });
};

const runCommand = (command, args, options = {}) => {
  return new Promise((resolve) => {
    execFile(
      command,
      args,
      {
        timeout: options.timeout || 5000,
        maxBuffer: 1024 * 1024,
      },
      (error, stdout, stderr) => {
        resolve({
          error,
          stdout,
          stderr,
        });
      }
    );
  });
};

const runCCode = async (req, res) => {
  const { code } = req.body;

  if (!code || !code.trim()) {
    return res.status(400).json({
      success: false,
      message: "Code is required",
    });
  }

  if (code.length > 10000) {
    return res.status(400).json({
      success: false,
      message: "Code is too long. Maximum 10,000 characters allowed.",
    });
  }

  ensureTempDir();

  const fileId = crypto.randomBytes(10).toString("hex");
  const sourceFile = path.join(TEMP_DIR, `${fileId}.c`);
  const outputFile = path.join(TEMP_DIR, `${fileId}.out`);

  try {
    fs.writeFileSync(sourceFile, code);

    const compileResult = await runCommand(
      "gcc",
      [sourceFile, "-o", outputFile],
      {
        timeout: 5000,
      }
    );

    if (compileResult.error) {
      cleanupFiles([sourceFile, outputFile]);

      return res.status(200).json({
        success: false,
        stage: "compile",
        output: compileResult.stderr || compileResult.error.message,
      });
    }

    const runResult = await runCommand(outputFile, [], {
      timeout: 3000,
    });

    cleanupFiles([sourceFile, outputFile]);

    if (runResult.error) {
      return res.status(200).json({
        success: false,
        stage: "runtime",
        output:
          runResult.stderr ||
          runResult.error.message ||
          "Runtime error occurred",
      });
    }

    return res.status(200).json({
      success: true,
      stage: "completed",
      output: runResult.stdout || "Program executed successfully with no output.",
    });
  } catch (error) {
    cleanupFiles([sourceFile, outputFile]);

    console.error("C COMPILER ERROR:", error);

    return res.status(500).json({
      success: false,
      stage: "server",
      output: "Server error while running C code",
      error: error.message,
    });
  }
};

module.exports = {
  runCCode,
};