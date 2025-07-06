const fs = require('fs');
const path = require('path');

/**
 * Bundle Analysis Script
 * 
 * This script analyzes the built bundle to provide size information
 * and help track bundle size changes over time.
 */

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function analyzeBundle() {
  const bundlePath = path.join(__dirname, '../dist/datedreamer.js');
  
  if (!fs.existsSync(bundlePath)) {
    console.error('❌ Bundle not found. Run "yarn build" first.');
    process.exit(1);
  }

  const stats = fs.statSync(bundlePath);
  const size = stats.size;
  const gzippedSize = require('zlib').gzipSync(fs.readFileSync(bundlePath)).length;

  console.log('📦 Bundle Analysis');
  console.log('==================');
  console.log(`📄 File: datedreamer.js`);
  console.log(`📏 Size: ${formatBytes(size)}`);
  console.log(`🗜️  Gzipped: ${formatBytes(gzippedSize)}`);
  console.log(`📊 Compression ratio: ${((1 - gzippedSize / size) * 100).toFixed(1)}%`);
  
  // Save analysis to file for tracking
  const analysis = {
    timestamp: new Date().toISOString(),
    size,
    gzippedSize,
    compressionRatio: (1 - gzippedSize / size) * 100
  };

  const analysisPath = path.join(__dirname, '../bundle-analysis.json');
  fs.writeFileSync(analysisPath, JSON.stringify(analysis, null, 2));
  
  console.log(`\n💾 Analysis saved to: bundle-analysis.json`);
  
  // Check for significant size changes
  if (fs.existsSync(analysisPath)) {
    const previousAnalysis = JSON.parse(fs.readFileSync(analysisPath, 'utf8'));
    const sizeDiff = size - previousAnalysis.size;
    const gzipDiff = gzippedSize - previousAnalysis.gzippedSize;
    
    if (Math.abs(sizeDiff) > 1024) { // 1KB threshold
      console.log(`\n⚠️  Bundle size changed by ${formatBytes(Math.abs(sizeDiff))} (${sizeDiff > 0 ? '+' : '-'})`);
      console.log(`🗜️  Gzipped size changed by ${formatBytes(Math.abs(gzipDiff))} (${gzipDiff > 0 ? '+' : '-'})`);
    }
  }
}

if (require.main === module) {
  analyzeBundle();
}

module.exports = { analyzeBundle }; 