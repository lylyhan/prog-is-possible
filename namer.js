const chance = require("chance"); // load the chance module
const c = new chance(); // Create an actual chance instace. See the docs.

function randomName(){
	return c.name();
}

function randomPlace(){
	return c.street();
}

console.log(`Your new random name is ${c.name()}`);
console.log(`You live on ${c.street()} in ${c.state()}`);
