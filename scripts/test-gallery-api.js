const fs = require('fs').promises;
const path = require('path');

async function testGalleryAPI() {
  try {
    console.log('Testing gallery API logic...');
    
    // Path to the gallery directory
    const galleryPath = path.join(__dirname, '..', 'public', 'media', 'gallery');
    console.log('Gallery path:', galleryPath);
    
    // Check if directory exists
    try {
      await fs.access(galleryPath);
      console.log('✅ Gallery directory exists');
    } catch (error) {
      console.log('❌ Gallery directory does not exist');
      return;
    }

    const files = await fs.readdir(galleryPath);
    console.log(`Found ${files.length} total files`);
    
    // Filter for media files
    const mediaFiles = files
      .filter(file => {
        if (file.startsWith('.')) return false;
        const ext = path.extname(file).toLowerCase();
        return ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.mp4', '.mov', '.avi'].includes(ext);
      })
      .map((file, index) => {
        const ext = path.extname(file).toLowerCase();
        return {
          id: index + 1,
          type: ['.mp4', '.mov', '.avi'].includes(ext) ? 'video' : 'image',
          src: `/media/gallery/${file}`,
          format: ext.substring(1),
          filename: file
        };
      });

    // Sort by filename
    mediaFiles.sort((a, b) => a.filename.localeCompare(b.filename));

    console.log(`✅ Found ${mediaFiles.length} media files:`);
    
    // Show first few and last few files to verify happy.png and serious.png are included
    const showFiles = mediaFiles.slice(0, 5).concat(
      mediaFiles.length > 10 ? ['...'] : [],
      mediaFiles.slice(-5)
    );
    
    showFiles.forEach((item, index) => {
      if (item === '...') {
        console.log('  ...');
      } else {
        console.log(`  ${item.id}. ${item.filename} (${item.type}/${item.format})`);
      }
    });

    // Specifically check for our new files
    const happyFile = mediaFiles.find(f => f.filename === 'happy.png');
    const seriousFile = mediaFiles.find(f => f.filename === 'serious.png');
    
    console.log('\n🔍 Checking for new files:');
    console.log(happyFile ? '✅ happy.png found' : '❌ happy.png not found');
    console.log(seriousFile ? '✅ serious.png found' : '❌ serious.png not found');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testGalleryAPI();
