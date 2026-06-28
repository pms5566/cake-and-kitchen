const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static website files
app.use(express.static(path.join(__dirname)));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

const DATA_FILE = path.join(__dirname, 'data.json');

// Helper to read data.json
function readData() {
    try {
        if (!fs.existsSync(DATA_FILE)) {
            return { menu: [], gallery: [] };
        }
        const raw = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(raw);
    } catch (err) {
        console.error("Error reading data.json:", err);
        return { menu: [], gallery: [] };
    }
}

// Helper to write data.json
function writeData(data) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
    } catch (err) {
        console.error("Error writing data.json:", err);
    }
}

// Simple Admin Login
const ADMIN_PASSWORD = 'admin'; // Customizable

app.post('/api/login', (req, res) => {
    const { password } = req.body;
    if (password === ADMIN_PASSWORD) {
        return res.json({ success: true, token: 'cake-kitchen-admin-token-12345' });
    }
    return res.status(401).json({ success: false, message: 'Invalid password' });
});

// GET dynamic data
app.get('/api/data', (req, res) => {
    res.json(readData());
});

// Configure Multer for local file storage in assets/images
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dest = path.join(__dirname, 'assets', 'images');
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }
        cb(null, dest);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, uniqueSuffix + ext);
    }
});

const upload = multer({ storage: storage });

// Helper to clean up unreferenced images
function cleanUpImage(imagePath) {
    if (!imagePath || !imagePath.startsWith('assets/images/')) return;
    const fullPath = path.join(__dirname, imagePath);
    
    // Check if the image is still referenced in menu or gallery
    const data = readData();
    const isReferencedInMenu = data.menu.some(item => item.image === imagePath);
    const isReferencedInGallery = data.gallery.some(item => item.image === imagePath);
    
    if (!isReferencedInMenu && !isReferencedInGallery) {
        fs.unlink(fullPath, (err) => {
            if (err) console.error("Error deleting image file:", fullPath, err);
            else console.log("Successfully deleted unreferenced image file:", fullPath);
        });
    }
}

// POST Add to Gallery
app.post('/api/gallery', upload.single('image'), (req, res) => {
    const { title, category, caption } = req.body;
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'Image file is required' });
    }
    
    const data = readData();
    const newItem = {
        id: 'g_' + Date.now(),
        image: 'assets/images/' + req.file.filename,
        title: title || 'Untitled',
        category: category || 'General',
        caption: caption || ''
    };
    
    data.gallery.push(newItem);
    writeData(data);
    
    res.json({ success: true, item: newItem });
});

// DELETE from Gallery
app.delete('/api/gallery/:id', (req, res) => {
    const { id } = req.params;
    const data = readData();
    const index = data.gallery.findIndex(item => item.id === id);
    
    if (index === -1) {
        return res.status(404).json({ success: false, message: 'Gallery item not found' });
    }
    
    const deletedItem = data.gallery[index];
    data.gallery.splice(index, 1);
    writeData(data);
    
    // Clean up the image file from disk
    cleanUpImage(deletedItem.image);
    
    res.json({ success: true, message: 'Gallery item deleted successfully' });
});

// POST Add to Menu
app.post('/api/menu', upload.single('image'), (req, res) => {
    const { title, category, desc, badge } = req.body;
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'Image file is required' });
    }
    
    const data = readData();
    const newItem = {
        id: 'm_' + Date.now(),
        category: category || 'custom-cakes',
        image: 'assets/images/' + req.file.filename,
        title: title || 'Untitled',
        desc: desc || '',
        badge: badge || ''
    };
    
    data.menu.push(newItem);
    writeData(data);
    
    res.json({ success: true, item: newItem });
});

// DELETE from Menu
app.delete('/api/menu/:id', (req, res) => {
    const { id } = req.params;
    const data = readData();
    const index = data.menu.findIndex(item => item.id === id);
    
    if (index === -1) {
        return res.status(404).json({ success: false, message: 'Menu item not found' });
    }
    
    const deletedItem = data.menu[index];
    data.menu.splice(index, 1);
    writeData(data);
    
    // Clean up image file from disk
    cleanUpImage(deletedItem.image);
    
    res.json({ success: true, message: 'Menu item deleted successfully' });
});

// Serve Admin Dashboard
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

app.listen(PORT, () => {
    console.log(`Cake & Kitchen server running at http://localhost:${PORT}`);
});
