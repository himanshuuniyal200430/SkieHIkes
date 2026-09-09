import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../utils/cloudinary.js';

const makeStorage = (folder) =>
  new CloudinaryStorage({
    cloudinary,
    params: {
      folder: `matrika-treks/${folder}`,
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: [{ width: 1600, height: 1600, crop: 'limit' }],
    },
  });

const maxFileSize = Number(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024;
const maxVideoSize = Number(process.env.MAX_VIDEO_SIZE) || 50 * 1024 * 1024;

const galleryStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'matrika-treks/gallery',
    resource_type: 'auto',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'mp4', 'mov', 'webm', 'avi', 'mkv'],
  },
});

const galleryFileFilter = (req, file, cb) => {
  const isImage = file.mimetype.startsWith('image/');
  const isVideo = file.mimetype.startsWith('video/');
  if (isImage || isVideo) return cb(null, true);
  cb(new Error('Only image or video files are allowed'));
};

export const uploadPackageImages = multer({
  storage: makeStorage('packages'),
  limits: { fileSize: maxFileSize },
}).array('images', 10);

export const uploadGalleryImages = multer({
  storage: galleryStorage,
  fileFilter: galleryFileFilter,
  limits: { fileSize: maxVideoSize },
}).array('images', 10);
