const html = document.documentElement;
const canvas = document.getElementById('hero-lightpass');
const context = canvas.getContext('2d');

const frameCount = 38;
const currentFrame = (index) => `/images/${index.toString().padStart(4, '0')}.png`;

/**
 * 1. Array of frames - length 38
 * 2. Preload and store it in some object
 * 3. Access it using frameIndex
 */

const loadImage = (id) => {
  return new Promise((res, rej) => {
    const img = new Image();
    img.src = currentFrame(id);
    img.onload = () => res(img);
    img.onerror = () => rej('Failed to load image');
  });
};

const preloadImages = () => {
  const promises = Array.from({ length: frameCount }, (_, i) => i + 1).map(loadImage);

  return Promise.all(promises);
};

const img = new Image();
img.src = currentFrame(1);

canvas.width = 1158;
canvas.height = 770;

img.onload = function () {
  context.drawImage(img, 0, 0);
};

const clearCanvas = () => {
  context.clearRect(0, 0, canvas.width, canvas.height);
};

const updateImage = (image) => {
  clearCanvas();
  console.log('IMAGE: ', image);
  context.drawImage(image, 0, 0);
};

window.addEventListener('DOMContentLoaded', async () => {
  const images = await preloadImages();

  let prev = 0;

  window.addEventListener('scroll', () => {
    const scrollTop = html.scrollTop;
    const maxScrollTop = html.scrollHeight - window.innerHeight;
    const scrollFraction = scrollTop / maxScrollTop;
    const frameIndex = Math.min(frameCount - 1, Math.ceil(scrollFraction * frameCount));

    if (prev === frameIndex) return console.warn('Same frame index: ', frameIndex);

    prev = frameIndex;

    requestAnimationFrame(() => updateImage(images[frameIndex]));
  });
});
