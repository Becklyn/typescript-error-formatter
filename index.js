const fs = require("fs");
const path = require("path");

/**
 * Renders a single error
 *
 * @param {{code: number, severity: string, content: string, file: string, line: number, character: number}} message
 * @param {chalk} colors
 * @param {string} cwd
 * @returns {string}
 */
module.exports = function (message, colors, cwd)
{
    let buffer = [];
    let fileContent = "" !== message.file
        ? fs.readFileSync(message.file, "utf-8").split("\n")
        : [];
    let relativeFile = "" !== message.file
        ? path.relative(cwd, message.file)
        : "?";
    let lineStart = Math.max(1, message.line - 2);
    let lineEnd = Math.min(fileContent.length, message.line + 1);

    let header = message.severity.substr(0, 1).toUpperCase() + message.severity.substr(1) + " ";

    buffer.push("");
    buffer.push(
        colors.red(header) +
        colors.red("─".repeat(process.stdout.columns - header.length - relativeFile.length - 2)) +
        colors.yellow(" " + relativeFile)
    );

    buffer.push("");
    buffer.push(message.content + " " + colors.gray(`TS${message.code}`));
    buffer.push("");

    if (fileContent.length > 0)
    {
        for (let line = lineStart; line <= lineEnd; line++)
        {
            buffer.push(
                colors.gray(("" + line).padStart(5, " ") + "│") +
                " " +
                fileContent[line - 1]
            );

            if (line === message.line)
            {
                buffer.push(
                    colors.red("!".padStart(5, " ")) +
                    colors.gray("│") +
                    " " +
                    " ".repeat(message.character - 1) + colors.red("↑")
                );
            }
        }
    }

    buffer.push("");
    return buffer.join("\n");
};
