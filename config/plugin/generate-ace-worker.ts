// copyFilesPlugin.js

import fs from 'fs';
import path from 'path';

const copyFiles = async (from, to) => {
  try {
    const content = await fs.promises.readdir(from);

    //
    await Promise.all(
      content.map(async (file) => {
        const filePath = path.join(from, file);
        const outputPath = path.join(to, file);
        await fs.promises.copyFile(filePath, outputPath);
      })
    );

    console.log('Files copied successfully!');
  } catch (err) {
    console.error('Error copying files:', err);
  }
};

export default function generateAceWorkerPlugin(options) {
  const { from, to } = options;

  return {
    name: 'generate-worker-plugin',
    apply: 'build',
    enforce: 'post',
    async generateBundle() {
      // check if the source folder exists
      if (!fs.existsSync(from)) {
        console.error(`Source folder ${from} does not exist.`);
        return;
      }

      // create the target folder
      if (!fs.existsSync(to)) {
        fs.mkdirSync(to, { recursive: true });
      }
      // write the from dir to to dir
      copyFiles(from, to);
    }
  };
}
