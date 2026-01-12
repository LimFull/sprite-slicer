# Sprite Slicer

A simple CLI tool to slice sprite sheets into individual frame images.

## Installation

```bash
npm install
```

## Usage

### Single Image

```bash
node index.js <image> <columns> <rows> [name]
```

**Parameters:**
- `image` - Path to the sprite sheet image
- `columns` - Number of columns in the sprite sheet
- `rows` - Number of rows in the sprite sheet
- `name` (optional) - Custom name for output files

**Examples:**
```bash
# Slice a 4x3 sprite sheet
node index.js spritesheet.png 4 3

# Slice with custom output name
node index.js spritesheet.png 4 3 walk
```

Output: `result/walk-001.png`, `result/walk-002.png`, ...

---

### Batch Processing (auto folder)

Process multiple sprite sheets at once by placing them in the `auto` folder.

```bash
node index.js auto <columns> <rows> [name]
```

**Examples:**
```bash
# Process all images in auto folder
node index.js auto 4 3

# Process with custom name (sequential numbering across all files)
node index.js auto 4 3 run
```

**How it works:**
1. Create an `auto` folder in the project directory
2. Place your sprite sheet images inside
3. Run the command
4. All frames are saved to the `result` folder

When using a custom name, frames are numbered sequentially across all images (e.g., `run-001.png` to `run-024.png` for 2 images with 12 frames each).

---

## Supported Formats

- PNG
- JPG / JPEG
- WebP
- GIF
- BMP

## Output

All sliced frames are saved to the `result` folder as PNG files with 3-digit numbering (e.g., `sprite-001.png`).

## License

MIT
