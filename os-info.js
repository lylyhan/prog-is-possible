const os = require("os"); // pull in the 'os' node module (part of node)

console.log(`Looks like you're running ${os.platform()} ${os.arch()}`);
