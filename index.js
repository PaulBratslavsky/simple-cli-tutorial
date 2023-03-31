#!/usr/bin/env node
const { downloadVideo } = require('./video-download');
const { convertVideo } = require('./convert-video'); 
console.log('Hello CLI World');

const { program } = require('commander');

// Define the CLI tool version
program.version('1.0.0');

// Define a command with options and a description
program
  .command('greet <name>')
  .option('-c, --capitalize', 'Capitalize the name')
  .description('Greets the user with their name')
  .action((name, options) => {
    let output = `Hello, ${options.capitalize ? name.toUpperCase() : name}!`;
    console.log(output);
  });

  // Download command with its options and action
program
.command('download <videoUrl>')
.description('Download a YouTube video')
.option('-f, --folder <folderName>', 'Output folder name', 'downloads')
.option('-n, --name <fileName>', 'Output file name (without extension)', 'video')
.action(async (videoUrl, options) => {
  try {
    const { folder: folderName, name: fileName } = options;
    const outputFile = await downloadVideo(videoUrl, folderName, fileName);
    console.log(`Video saved at: ${outputFile}`);
  } catch (err) {
    console.error('An error occurred:', err.message);
  }
});

// Set up video to audio command with its options and action
program
  .command('convert <videoFilePath>')
  .description('Convert a video file to an MP3 audio file')
  .option('-f, --folder <folderName>', 'Output folder name', 'converted')
  .option('-n, --name <fileName>', 'Output file name (without extension)', 'audio')
  .action(async (videoFilePath, options) => {
    try {
      const { folder: folderName, name: fileName } = options;
      const outputFile = await convertVideo(videoFilePath, folderName, fileName);
      console.log(`Audio file saved at: ${outputFile}`);
    } catch (err) {
      console.error('An error occurred:', err.message);
    }
  });

// Parse command line arguments
program.parse(process.argv);