import mongoose from 'mongoose';
import { GridFSBucket } from 'mongodb';

let bucket;

// Initialize GridFS bucket after MongoDB connection
const initializeBucket = () => {
    if (!bucket && mongoose.connection.db) {
        console.log('Initializing GridFS bucket...');
        bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
            bucketName: 'images'
        });
        console.log('GridFS bucket initialized successfully');
    }
};

// Upload image
export const uploadImage = async (req, res) => {
    try {
        console.log('Received image upload request');
        if (!req.file) {
            console.log('No file in request');
            return res.status(400).json({ message: 'No file uploaded' });
        }

        console.log('File details:', {
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size
        });

        // Ensure bucket is initialized
        initializeBucket();
        if (!bucket) {
            console.log('Bucket initialization failed');
            return res.status(500).json({ message: 'Database connection not ready' });
        }

        // Create a new file in GridFS
        console.log('Creating upload stream...');
        const uploadStream = bucket.openUploadStream(req.file.originalname, {
            metadata: {
                contentType: req.file.mimetype
            }
        });

        // Write the file buffer to GridFS
        console.log('Writing file to GridFS...');
        uploadStream.write(req.file.buffer);
        uploadStream.end();

        // Wait for the upload to complete
        await new Promise((resolve, reject) => {
            uploadStream.on('finish', () => {
                console.log('Upload completed successfully');
                resolve();
            });
            uploadStream.on('error', (error) => {
                console.error('Upload error:', error);
                reject(error);
            });
        });

        // Return the file ID
        console.log('Upload successful, fileId:', uploadStream.id);
        res.status(201).json({ 
            fileId: uploadStream.id,
            message: 'Image uploaded successfully'
        });
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ message: 'Failed to upload image', error: error.message });
    }
};

// Get image by ID
export const getImage = async (req, res) => {
    try {
        const { fileId } = req.params;
        console.log('Retrieving image with ID:', fileId);
        
        // Ensure bucket is initialized
        initializeBucket();
        if (!bucket) {
            console.log('Bucket initialization failed');
            return res.status(500).json({ message: 'Database connection not ready' });
        }

        // Find the file in GridFS
        console.log('Searching for file in GridFS...');
        const files = await bucket.find({ _id: new mongoose.Types.ObjectId(fileId) }).toArray();
        
        if (!files.length) {
            console.log('File not found');
            return res.status(404).json({ message: 'Image not found' });
        }

        console.log('File found:', {
            filename: files[0].filename,
            contentType: files[0].metadata.contentType,
            length: files[0].length
        });

        // Set the content type
        res.set('Content-Type', files[0].metadata.contentType);

        // Create a download stream
        console.log('Creating download stream...');
        const downloadStream = bucket.openDownloadStream(new mongoose.Types.ObjectId(fileId));
        
        // Pipe the file to the response
        downloadStream.pipe(res);
        console.log('File streaming started');
    } catch (error) {
        console.error('Error retrieving image:', error);
        res.status(500).json({ message: 'Failed to retrieve image', error: error.message });
    }
};