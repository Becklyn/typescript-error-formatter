const fs = require("fs");
const path = require("path");

/**
 * Renders a single error
 *
 * @param {{code: number, severity: string, content: string, file: string, line: number, character: number}} message
 * @param {chalk} colors
 * @param {string} cwd
 */
module.exports = function (message, colors, cwd)
{
    const fileContent = "" !== message.file
        ? fs.readFileSync(message.file, "utf-8").split("\n")
        : [];
    const relativeFile = "" !== message.file
        ? path.relative(cwd, message.file)
        : "?";
    const lineStart = Math.max(0, message.line - 2);
    const lineEnd = Math.min(fileContent.length, message.line + 1);

    const header = message.severity.substr(0, 1).toUpperCase() + message.severity.substr(1) + " ";

    console.log("");
    console.log(
        colors.red(header) +
        colors.red("─".repeat(process.stdout.columns - header.length - relativeFile.length - 2)) +
        colors.yellow(" " + relativeFile)
    );

    console.log("");
    console.log(message.content + " " + colors.gray(`TS${message.code}`));
    console.log("");

    if (fileContent.length > 0)
    {
        for (let line = lineStart; line <= lineEnd; line++)
        {
            console.log(
                colors.gray(("" + line).padStart(5, " ") + "│") +
                " " +
                fileContent[line - 1]
            );

            if (line === message.line)
            {
                console.log(
                    colors.red("!".padStart(5, " ")) +
                    colors.gray("│") +
                    " " +
                    " ".repeat(message.character - 1) + colors.red("↑")
                );
            }
        }
    }

    console.log("");
};
