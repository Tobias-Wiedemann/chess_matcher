const path = require('path');
const fs = require('fs');

let resultPath = "generated.txt";
let finalData = "";

for (let i = 0; i < 11; i++) {
    finalData = finalData + "Player" + (Math.floor(Math.random() * 10000)).toString() + ", " + (Math.floor(Math.random() * 2300)).toString() + "\n";
}

try {
    fs.writeFile(resultPath, finalData, err => {
        if (err) {
            console.error(err);
        } else {
            // file written successfully
        }
    });
} catch (e) {
    console.log(e);
}
