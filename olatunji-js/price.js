const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

console.log("Hello, customer!");
console.log("\nInput your name and age below");
let age;
let name;
rl.question("Name: ", (answerName) => {
    name = answerName;

rl.question("Age: ", (answerAge) => {
    age = answerAge;

        if (age >= 65) {
    console.log("Your price is $6.00");
} else if (age >= 18 && age < 65) {
    console.log("your price is $10.00");
} else if (age >= 13 && age < 18) {
    console.log("Your price is $7.00");
} else if (age > 3 && age < 13) {
    console.log("Your price is $5.00");
} else {
    console.log("Your price is $0.00");
}


    console.log("\nThanks, " + name + "!");
rl.close();
});
});
