## How To Build A Simple CLI

A CLI, or Command Line Interface, is a type of user interface that allows users to interact with a program by entering commands in the form of text lines. It operates in a text-based environment, usually a terminal or console, where users input commands and receive text responses from the program.

## What Are We Going To Build

We are going to build a simple CLI tool that will allow you to download videos from youtube as well as convert them to audio files.

## Prerequesetes

Make sure that you have node and npm installed. We will use it to download necessary packages that we need for you CLI.

```bash
	node -v
	npm -v
```

## Getting Started

Create directory for you CLI tool:

```bash
	mkdir cli-tool
	cd cli-tool
```

Init yout project by running `npm init`

```bash
➜  cli npm init
This utility will walk you through creating a package.json file.
It only covers the most common items, and tries to guess sensible defaults.

See `npm help init` for definitive documentation on these fields
and exactly what they do.

Use `npm install <pkg>` afterwards to install a package and
save it as a dependency in the package.json file.

Press ^C at any time to quit.
package name: (cli) y
version: (1.0.0)
description: CLI tool do download YT videos and convert to MP3
entry point: (index.js)
test command:
git repository:
keywords:
author: Paul Bratslavsky
license: (ISC)
About to write to /Users/paulbratslavsky/Desktop/stream/cli/package.json:

{
  "name": "cli-tool",
  "version": "1.0.0",
  "description": "CLI tool do download YT videos and convert to MP3",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "Paul Bratslavsky",
  "license": "ISC"
}

```

Open your project in `vs code`

Once your project is open go ahead and create an entry file called `index.js`

## What Is Cammander

`commander` is a popular Node.js package that helps to build command-line interfaces (CLIs) in an easy and organized manner. It simplifies the process of parsing command-line arguments, defining commands, handling flags, options, and displaying help documentation.

Let's go ahead and install it now by running the following command:

```bash
npm install commander
```

Once commander is installed let's start building out our CLI.

## Make Your Script Executable

Add the following at the top of your `index.js` file:

```javasript
#!/usr/bin/env node
```

This command tells our operating system to use `node` to execute our command.

Now update your `package.json` file to include the following code:

```json
"bin": { "cli-tool": "./index.js" },
```

The above command will alow us to run our cli by typing `cli-tool` in our terminal.

But before we can get it to work. We need to install it globally by creating a global symlink. We can do it by running the following command:

```bash
npm link
```

Now before testing it out. Let's add a simple console.log in our `index.js` file

```javascript
#!/usr/bin/env node
console.log("Hello CLI World");
```

note: if you need to unlink your CLI tool you can run the following command:

```bash
npm unlink <name-of-package>
```

example:

```bash
npm unlink cli-tool
```

we can test our CLI tool by running the following:

```bash
cli-tool
```

## Commander Template Example

Let's set up `commander` example so we can use it as reference as we build out our cli command tool.

Let's enter the following code below.

```javascript
#!/usr/bin/env node
console.log("Hello CLI World");

const { program } = require("commander");

// Define the CLI tool version
program.version("1.0.0");

// Define a command with options and a description
program
  .command("greet <name>")
  .option("-c, --capitalize", "Capitalize the name")
  .description("Greets the user with their name")
  .action((name, options) => {
    let output = `Hello, ${options.capitalize ? name.toUpperCase() : name}!`;
    console.log(output);
  });

// Parse command line arguments
program.parse(process.argv);
```

The cool part about commander is that it automatically creates help documentation.

You can run the help command with the following code:

```bash
cli-tool help
```

Output:

```bash
➜  cli cli-tool help
Hello CLI World
Usage: cli-tool [options] [command]

Options:
  -V, --version           output the version number
  -h, --help              display help for command

Commands:
  greet [options] <name>  Greets the user with their name
  help [command]          display help for command
➜  cli
```

Let's test out our `commander` tool, type in the following:

```bash
cli-tool greet -c paul
```

Output:

```bash
Hello CLI World
Hello, PAUL!
```

Now that we have the basic down. Lets create a file that will have our logic to download a video from youtube.

## Video Download Logic

Inside your folder create a file called `video-download.js`

Paste in the following code:
`vide-download.js`

```javascript
// Import the 'fs' module to interact with the file system
const fs = require("fs");

// Import the 'path' module to handle file and directory paths
const path = require("path");

// Import the 'ytdl-core' module to download YouTube videos
const ytdl = require("ytdl-core");

// Define an asynchronous function called 'downloadVideo' that takes three arguments:

// 'videoUrl', 'folderName', and 'fileName'

async function downloadVideo(videoUrl, folderName, fileName) {
  // Create the output file path by joining the folder name and file name (with .mp4 extension)

  const outputFile = path.join(folderName, `${fileName}.mp4`);

  // Check if the output file already exists; if so, log a message and return the file path

  if (fs.existsSync(outputFile)) {
    console.log("Video already downloaded");
    return outputFile;
  }

  // Check if the specified folder exists; if not, create it

  if (!fs.existsSync(folderName)) {
    fs.mkdirSync(folderName);
  }

  // Create a readable stream for the video using the 'ytdl' module with the highest quality available
  const videoStream = ytdl(videoUrl, { quality: "highest" });

  // Create a writable stream for the output file
  const writeStream = fs.createWriteStream(outputFile);

  // Return a new Promise that resolves with the output file path when the video is downloaded,

  // or rejects with an error if there's an issue during the download

  return new Promise((resolve, reject) => {
    // Pipe the video stream into the write stream, effectively downloading the video
    videoStream.pipe(writeStream);

    // When the write stream finishes, call the 'resolveFunction'
    writeStream.on("finish", () => {
      console.log("Video downloaded");
      resolve(outputFile);
    });

    // If there's an error with the video stream, call the 'rejectFunction' with the error

    videoStream.on("error", () => {
      console.log("Error downloading video");
      reject(err);
    });
  });
}

// Export the 'downloadVideo' function as a module
module.exports = {
  downloadVideo,
};
```

In order for this to work, we first need to install the package tha will allow us to download videos.

We will be using `ytdl-core` you can learn more about it [here](https://www.npmjs.com/package/ytdl-core)

And you can learn more about node commands [here](https://nodejs.org/en/docs)

You can install the package by runnig the following command:

```bash
npm install ytdl-core
```

## Commander Download Logic

Add the following code to you `index.js` file:

```javascript
const { downloadVideo } = require("./video-download");

// Download command with its options and action

program
  .command("download <videoUrl>")
  .description("Download a YouTube video")
  .option("-f, --folder <folderName>", "Output folder name", "downloads")
  .option(
    "-n, --name <fileName>",
    "Output file name (without extension)",
    "video"
  )
  .action(async (videoUrl, options) => {
    try {
      const { folder: folderName, name: fileName } = options;
      const outputFile = await downloadVideo(videoUrl, folderName, fileName);
      console.log(`Video saved at: ${outputFile}`);
    } catch (err) {
      console.error("An error occurred:", err.message);
    }
  });
```

Let's test out our new CLI command with the following:

```bash
cli-tool download https://www.youtube.com/watch?v=w5MpbkNEM1Q -f videos -n test
```

Output:

```bash
➜  cli cli-tool download https://www.youtube.com/watch\?v\=w5MpbkNEM1Q -f videos -n test
Hello CLI World
Video downloaded
Video saved at: videos/test.mp4
```

Nice. We were able to download the video. Let's now do our last function that will conver our video to audio.

## Convert Video To Audio Logic

In order to conver our video to audio we will need to add additional node packages, but first let's look at the code.

Let's create a new file named `convert-video.js`

```javascript
// Import the 'path' module to handle file and directory paths
const path = require("path");
// Import the 'fs' module to interact with the file system
const fs = require("fs");
// Import the 'ffmpeg-static' module to get the path to a statically linked FFmpeg binary
const ffmpegPath = require("ffmpeg-static");
// Import the 'fluent-ffmpeg' module to interact with the FFmpeg library
const ffmpeg = require("fluent-ffmpeg");

// Set the path to the FFmpeg binary for 'fluent-ffmpeg' to use
ffmpeg.setFfmpegPath(ffmpegPath);

// Define an asynchronous function called 'convertVideo' that takes three arguments:
// 'videoFilePath', 'folderName', and 'fileName'
async function convertVideo(videoFilePath, folderName, fileName) {
  // Create the output file path by joining the folder name and file name (with .mp3 extension)
  const outputFile = path.join(folderName, `${fileName}.mp3`);

  // Check if the output file already exists; if so, log a message and return the file path
  if (fs.existsSync(outputFile)) {
    console.log("Audio file already converted");
    return outputFile;
  }

  // Check if the specified folder exists; if not, create it
  if (!fs.existsSync(folderName)) {
    fs.mkdirSync(folderName);
  }

  // Return a new Promise that resolves with the output file path when the conversion is complete,
  // or rejects with an error if there's an issue during the conversion
  return new Promise((resolve, reject) => {
    // Create a new 'fluent-ffmpeg' instance for the input video file
    ffmpeg(videoFilePath)
      // Set the output options to convert the video to MP3 format with the desired settings
      .outputOptions([
        "-vn", // No video (audio only)
        "-acodec",
        "libmp3lame", // Use the LAME MP3 codec
        "-ac",
        "2", // 2 audio channels (stereo)
        "-ab",
        "160k", // 160 kbps audio bitrate
        "-ar",
        "48000", // 48,000 Hz audio sample rate
      ])
      // Save the output file to the specified path
      .save(outputFile)
      // Listen for the 'error' event and reject the Promise with the error if it occurs
      .on("error", (error) => {
        console.error("FFmpeg error:", error);
        reject(error);
      })
      // Listen for the 'end' event and resolve the Promise with the output file path when the conversion is complete
      .on("end", () => {
        console.log("FFmpeg process completed");
        resolve(outputFile);
      });
  });
}

// Export the 'convertVideo' function as a module
module.exports = {
  convertVideo,
};
```

For this code to work we need to install two new packages `ffmpeg-static` and `fluent-ffmpeg`:

You can install both by running the follwing command:

```bash
npm install ffmpeg-static fluent-ffmpeg
```

Great now it's time to hook up this logic using commander.

## Convert Video To Audio Commander Logic

Here is the code to hook up our video to audio conver logic using commander.

`index.js`

```javascript
const { convertVideo } = require("./convert-video");

// Set up video to audio command with its options and action
program
  .command("convert <videoFilePath>")
  .description("Convert a video file to an MP3 audio file")
  .option("-f, --folder <folderName>", "Output folder name", "converted")
  .option(
    "-n, --name <fileName>",
    "Output file name (without extension)",
    "audio"
  )
  .action(async (videoFilePath, options) => {
    try {
      const { folder: folderName, name: fileName } = options;
      const outputFile = await convertVideo(
        videoFilePath,
        folderName,
        fileName
      );
      console.log(`Audio file saved at: ${outputFile}`);
    } catch (err) {
      console.error("An error occurred:", err.message);
    }
  });
```

We can see the options by running the following command:

```bash
cli-tool help convert
```

Output:

```bash
Usage: cli-tool convert [options] <videoFilePath>

Convert a video file to an MP3 audio file

Options:
  -f, --folder <folderName>  Output folder name (default: "converted")
  -n, --name <fileName>      Output file name (without extension) (default: "audio")
  -h, --help                 display help for command
➜  cli
```

Let's test it out by converting our previously downloaded video by running this command:

```bash
cli-tool convert videos/test.mp4 -f audio -n test
```

Great. We did it. Great job and a high five.

## Conclusion

I hope you had as much fun as I did furing this tutorial.

I will make sure to share the repo with the finished code.
# simple-cli-tutorial
