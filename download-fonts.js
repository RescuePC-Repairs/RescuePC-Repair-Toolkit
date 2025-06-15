const https = require('https');
const fs = require('fs');
const path = require('path');
const config = require('./assets/css/fontawesome/config.js');

class FontDownloader {
  constructor() {
    this.config = config;
    this.fonts = this.getFontList();
    this.webfontsDir = path.join(__dirname, this.config.local.fonts);
  }

  /**
   * Get list of fonts to download
   * @returns {Array} List of font objects with url and filename
   */
  getFontList() {
    return [
      {
        url: `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/${this.config.version}/webfonts/fa-solid-900.woff2`,
        filename: 'fa-solid-900.woff2'
      },
      {
        url: `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/${this.config.version}/webfonts/fa-solid-900.ttf`,
        filename: 'fa-solid-900.ttf'
      },
      {
        url: `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/${this.config.version}/webfonts/fa-brands-400.woff2`,
        filename: 'fa-brands-400.woff2'
      },
      {
        url: `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/${this.config.version}/webfonts/fa-brands-400.ttf`,
        filename: 'fa-brands-400.ttf'
      },
      {
        url: `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/${this.config.version}/webfonts/fa-regular-400.woff2`,
        filename: 'fa-regular-400.woff2'
      },
      {
        url: `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/${this.config.version}/webfonts/fa-regular-400.ttf`,
        filename: 'fa-regular-400.ttf'
      }
    ];
  }

  /**
   * Create webfonts directory if it doesn't exist
   */
  createWebfontsDir() {
    if (!fs.existsSync(this.webfontsDir)) {
      fs.mkdirSync(this.webfontsDir, { recursive: true });
      console.log('Created webfonts directory');
    }
  }

  /**
   * Download a single font file
   * @param {Object} font Font object with url and filename
   * @returns {Promise} Promise that resolves when download is complete
   */
  downloadFont(font) {
    return new Promise((resolve, reject) => {
      const filePath = path.join(this.webfontsDir, font.filename);
      const file = fs.createWriteStream(filePath);

      https.get(font.url, response => {
        response.pipe(file);

        file.on('finish', () => {
          file.close();
          console.log(`Downloaded ${font.filename}`);
          resolve();
        });
      }).on('error', err => {
        fs.unlink(filePath, () => {}); // Delete the file if there's an error
        console.error(`Error downloading ${font.filename}:`, err.message);
        reject(err);
      });
    });
  }

  /**
   * Download all font files
   */
  async downloadAllFonts() {
    try {
      this.createWebfontsDir();
      await Promise.all(this.fonts.map(font => this.downloadFont(font)));
      console.log('All fonts downloaded successfully');
    } catch (error) {
      console.error('Error downloading fonts:', error);
      process.exit(1);
    }
  }
}

// Create and run downloader
const downloader = new FontDownloader();
downloader.downloadAllFonts(); 