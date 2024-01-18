export const loadImage = (url, { document, width, height, defaultImg }) => {
  if (!url || !document) {
    return Promise.resolve(defaultImg);
  }
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = url;

    const canvas: any = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas?.getContext?.('2d');

    img.onload = function () {
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      resolve(imageData);
    };
    img.onerror = function () {
      console.log('load image error');
      resolve(defaultImg);
    };
  });
};

export const createCanvasImage = (url, { document, width, height }) => {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.src = url;

  const canvas: any = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas?.getContext?.('2d');
  return { image: img, canvas, ctx };
};

export default loadImage;
