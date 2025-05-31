import { Storage } from '@google-cloud/storage';

const storage = new Storage({
  keyFilename: 'google-cloud-key.json',
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID
});

const bucket = storage.bucket(process.env.GOOGLE_CLOUD_BUCKET_NAME);

// Upload image
export const uploadImage = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

        const blob = bucket.file(`${Date.now()}-${req.file.originalname}`);
        const blobStream = blob.createWriteStream({
            resumable: false,
            metadata: { contentType: req.file.mimetype }
        });

        blobStream.on('error', (error) => {
            res.status(500).json({ message: 'Upload failed', error: error.message });
        });

        blobStream.on('finish', async () => {
            await blob.makePublic();
            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
            res.status(201).json({ imageUrl: publicUrl });
        });

        blobStream.end(req.file.buffer);
    } catch (error) {
        res.status(500).json({ message: 'Upload failed', error: error.message });
    }
};

// Get image URL
export const getImage = async (req, res) => {
    try {
        const { filename } = req.params;
        const file = bucket.file(filename);
        const [exists] = await file.exists();
        
        if (!exists) return res.status(404).json({ message: 'Image not found' });
        
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;
        res.json({ imageUrl: publicUrl });
    } catch (error) {
        res.status(500).json({ message: 'Failed to get image', error: error.message });
    }
};