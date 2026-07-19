import { Jimp } from 'jimp';

async function makeTransparent() {
  try {
    const image = await Jimp.read('public/favicon.png');
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
      const r = this.bitmap.data[idx + 0];
      const g = this.bitmap.data[idx + 1];
      const b = this.bitmap.data[idx + 2];
      
      // If pixel is very dark (black background)
      if (r < 30 && g < 30 && b < 30) {
        this.bitmap.data[idx + 3] = 0; // set alpha to 0
      }
    });
    await image.writeAsync('public/favicon.png');
    console.log('Done!');
  } catch (err) {
    console.error(err);
  }
}

makeTransparent();
