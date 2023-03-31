const path = require('path');
const fs = require('fs');
const ffmpegPath = require('ffmpeg-static');
const ffmpeg = require('fluent-ffmpeg');

ffmpeg.setFfmpegPath(ffmpegPath);

async function convertVideo(videoFilePath, folderName, fileName) {
  const outputFile = path.join(folderName, `${fileName}.mp3`);

  if (fs.existsSync(outputFile)) {
    console.log('Audio file already converted');
    return outputFile;
  }

  if (!fs.existsSync(folderName)) {
    fs.mkdirSync(folderName);
  }

  return new Promise((resolve, reject) => {
    ffmpeg(videoFilePath)
      .outputOptions([
        '-vn', // No video (audio only)
        '-acodec', 'libmp3lame', // Use the LAME MP3 codec
        '-ac', '2', // 2 audio channels (stereo)
        '-ab', '160k', // 160 kbps audio bitrate
        '-ar', '48000' // 48,000 Hz audio sample rate
      ])
      .save(outputFile)
      .on('error', (error) => {
        console.error('FFmpeg error:', error);
        reject(error);
      })
      .on('end', () => {
        console.log('FFmpeg process completed');
        resolve(outputFile);
      });
  });
}

module.exports = {
  convertVideo,
};