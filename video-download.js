const fs = require('fs');
const path = require('path');
const ytdl = require('ytdl-core');

async function downloadVideo(videoUrl, folderName, fileName) {
  const outputFile = path.join(folderName, `${fileName}.mp4`);

  if (fs.existsSync(outputFile)) {
    console.log('Video already downloaded');
    return outputFile;
  }

  if (!fs.existsSync(folderName)) {
    fs.mkdirSync(folderName);
  }

  const videoStream = ytdl(videoUrl, { quality: 'highest' });
  const writeStream = fs.createWriteStream(outputFile);

  return new Promise((resolve, reject) => {
    videoStream.pipe(writeStream);
    writeStream.on('finish', () => {
      console.log('Video downloaded');
      resolve(outputFile);
    });
    videoStream.on('error', () => {
      console.log('Error downloading video');
      reject(err);
    });
  });

}

module.exports = {
  downloadVideo,
};
