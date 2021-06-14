const process = require('process');
const fs = require('fs');
const parser = require('iptv-playlist-parser');
const { title } = require('process');

const commandArguments = process.argv;

let inputFileLocation;
let outputFileLocation = "./output.omp";

let outputObject = {
  "name": "My converted M3U playlist",
  "description": "Converted with stock convertor",
  "format": {
      "omp-version": 1,
      "convertor": {
          "name": "Stock Convertor",
          "author": "RichardDorian",
          "version": "1.0"
      }
  },
  "categories": []
};

if(commandArguments.length == 3) {
  let inputFileLocationArgument = commandArguments[2];
  if(inputFileLocationArgument.endsWith('.m3u')) {
    inputFileLocation = inputFileLocationArgument;
    const data = fs.readFileSync(inputFileLocation, { encoding: 'utf8' });
    const parsedData = parser.parse(data);
    parsedData.items.forEach(element => {
      convert(element);
    });
  } else {
    console.error("This convertor only support M3U files");
    process.exit();
  }
} else {
  if(commandArguments.length == 2) console.error("Not enough arguments"); else console.error("Not many arguments");
  process.exit();
}

function convert(input) {
  if(typeof (outputObject.categories.find(({ name }) => name == input.group.title)) == 'undefined') {
    outputObject.categories.push({
      "name": input.group.title,
      "description": input.group.title,
      "content": []
    });
  }
  let categoryIndex = outputObject.categories.findIndex(({ name }) => name == input.group.title);
  delete input.group;
  delete input.raw;
  delete input.tvg;
  delete input.timeshift;
  delete input.catchup;
  outputObject.categories[categoryIndex].content.push(input);
}

fs.writeFileSync(outputFileLocation, JSON.stringify(outputObject, null, 2));