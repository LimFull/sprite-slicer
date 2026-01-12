const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.bmp'];
const RESULT_DIR = path.join(process.cwd(), 'result');

async function sliceSprite(imagePath, columns, rows, customName = null, startNumber = 1) {
  const parsedPath = path.parse(imagePath);
  const baseName = customName || parsedPath.name;
  const outputDir = RESULT_DIR;

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const image = sharp(imagePath);
  const metadata = await image.metadata();

  const frameWidth = Math.floor(metadata.width / columns);
  const frameHeight = Math.floor(metadata.height / rows);

  console.log(`\n[${parsedPath.base}]`);
  console.log(`Image size: ${metadata.width}x${metadata.height}`);
  console.log(`Frame size: ${frameWidth}x${frameHeight}`);
  console.log(`Total frames: ${columns * rows}`);

  let frameNumber = startNumber;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      const left = col * frameWidth;
      const top = row * frameHeight;

      const paddedNumber = String(frameNumber).padStart(3, '0');
      const outputFileName = `${baseName}-${paddedNumber}.png`;
      const outputPath = path.join(outputDir, outputFileName);

      await sharp(imagePath)
        .extract({
          left: left,
          top: top,
          width: frameWidth,
          height: frameHeight
        })
        .toFile(outputPath);

      console.log(`Saved: ${outputFileName}`);
      frameNumber++;
    }
  }

  const frameCount = columns * rows;
  console.log(`Done! ${frameCount} frames saved.`);
  return frameNumber;
}

async function processAutoFolder(columns, rows, customName = null) {
  const autoDir = path.join(process.cwd(), 'auto');

  if (!fs.existsSync(autoDir)) {
    console.error('Error: "auto" folder not found');
    console.log('Please create an "auto" folder and place your sprite images inside.');
    process.exit(1);
  }

  const files = fs.readdirSync(autoDir);
  const imageFiles = files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return IMAGE_EXTENSIONS.includes(ext);
  });

  if (imageFiles.length === 0) {
    console.error('Error: No image files found in "auto" folder');
    process.exit(1);
  }

  console.log(`Found ${imageFiles.length} image(s) in auto folder`);
  console.log(`Applying: ${columns} columns x ${rows} rows`);
  if (customName) {
    console.log(`Output name: ${customName}`);
  }

  let nextNumber = 1;

  for (const file of imageFiles) {
    const imagePath = path.join(autoDir, file);
    nextNumber = await sliceSprite(imagePath, columns, rows, customName, customName ? nextNumber : 1);
  }

  const totalFrames = customName ? nextNumber - 1 : imageFiles.length * columns * rows;
  console.log(`\n========================================`);
  console.log(`All done! Processed ${imageFiles.length} image(s), ${totalFrames} total frames.`);
}

const args = process.argv.slice(2);

if (args.length < 3) {
  console.log('Usage:');
  console.log('  Single image: node index.js <image> <columns> <rows> [name]');
  console.log('  Batch (auto): node index.js auto <columns> <rows> [name]');
  console.log('');
  console.log('Examples:');
  console.log('  node index.js spritesheet.png 4 3');
  console.log('  node index.js spritesheet.png 4 3 walk');
  console.log('  node index.js auto 4 3');
  console.log('  node index.js auto 4 3 run');
  process.exit(1);
}

const firstArg = args[0];
const columns = parseInt(args[1], 10);
const rows = parseInt(args[2], 10);
const customName = args[3] || null;

if (isNaN(columns) || isNaN(rows) || columns < 1 || rows < 1) {
  console.error('Error: columns and rows must be positive integers');
  process.exit(1);
}

if (firstArg === 'auto') {
  processAutoFolder(columns, rows, customName).catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
  });
} else {
  if (!fs.existsSync(firstArg)) {
    console.error(`Error: File not found: ${firstArg}`);
    process.exit(1);
  }

  sliceSprite(firstArg, columns, rows, customName).catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
  });
}
