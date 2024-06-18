const fs = require('fs');
const path = require('path');

// Make a directory called Files
const folderPath = path.join(__dirname,'files');
// Check if the directory exists
if (!fs.existsSync(folderPath)) {
    // Directory doesn't exist, create it
    fs.mkdir(folderPath, (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('Directory created!');
        }
    });
} else {
    console.log('Directory already exists!');
}


const fileContent = 'If You want you chan achieve anythings :)';
const fileName = 'greet.txt';

// Write a file
fs.writeFile(path.join(folderPath,fileName), fileContent, 'utf-8', (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('File written!');
    }
});

// Read a file
fs.readFile(path.join(folderPath,fileName), 'utf-8',(err, data) => {
    if (err) {
        console.log(err);
    }
    else{
        console.log(data);
    }
});



const demoPath = "src/**/entity/*{.ts,.js},"

