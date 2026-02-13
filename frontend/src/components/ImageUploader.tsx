import React, { useCallback, useState } from 'react';
import { useDropzone, type FileRejection } from 'react-dropzone';
import { Upload, X, FileImage, FileText, AlertCircle } from 'lucide-react';
import { uploadImage } from '../services/api';

interface ImageUploaderProps {
    onUploadComplete: (imageId: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onUploadComplete }) => {
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const onDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[]) => {
        setError(null);
        if (fileRejections.length > 0) {
            setError("Invalid file type. Please upload .dcm, .jpg, .jpeg, or .png images.");
            return;
        }

        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            setUploadedFile(file);

            // Create preview
            if (file.type.startsWith('image/')) {
                const objectUrl = URL.createObjectURL(file);
                setImagePreview(objectUrl);
            } else {
                setImagePreview(null);
            }
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
        onDrop,
        accept: {
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/png': ['.png'],
            // 'application/dicom': ['.dcm'] // Browser doesn't standardly support dicom MIME, so we rely on extension mainly
        },
        maxFiles: 1,
        // validator for custom dicom check if MIME fails or for extra safety? 
        // react-dropzone handles extensions well if passed correctly.
        // Let's rely on extension primarily for DICOM as mimetype vary.
        onDropRejected: () => setError("File rejected. Please check format and size.")
    });

    const handleUpload = async () => {
        if (!uploadedFile) return;

        setIsUploading(true);
        setUploadProgress(10); // Start progress

        try {
            // Simulate progress for UX (since axios progress isn't hooked up in the simple service yet, or we'd need to modify service)
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => Math.min(prev + 10, 90));
            }, 200);

            const response = await uploadImage(uploadedFile); // We should update api.ts to handle progress if we want real progress

            clearInterval(progressInterval);
            setUploadProgress(100);

            if (response && response.image_id) {
                onUploadComplete(response.image_id);
            } else {
                setError("Upload failed: No image ID received.");
                setIsUploading(false);
            }
        } catch (err: any) {
            console.error("Upload error:", err);
            setError(err.response?.data?.detail || "Upload failed. Please try again.");
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    const handleClear = () => {
        setUploadedFile(null);
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
            setImagePreview(null);
        }
        setUploadProgress(0);
        setIsUploading(false);
        setError(null);
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="w-full max-w-xl mx-auto">
            {/* Upload Area */}
            {!uploadedFile ? (
                <div
                    {...getRootProps()}
                    className={`
            h-[400px] border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors
            ${isDragActive ? 'border-blue-600 bg-blue-50' : 'border-gray-300 hover:border-blue-400 bg-white'}
            ${isDragReject ? 'border-red-500 bg-red-50' : ''}
            shadow-sm
          `}
                >
                    <input {...getInputProps()} />
                    <div className="bg-blue-100 p-4 rounded-full mb-4">
                        <Upload className="w-8 h-8 text-blue-600" />
                    </div>
                    <p className="text-xl font-semibold text-gray-700 mb-2">
                        {isDragActive ? "Drop image here" : "Drag & drop medical image"}
                    </p>
                    <p className="text-gray-500 mb-6">
                        DICOM, JPG, PNG (Max 25MB)
                    </p>
                    <div className="flex gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                            <FileImage className="w-4 h-4" /> JPG/PNG
                        </div>
                        <div className="flex items-center gap-1">
                            <FileText className="w-4 h-4" /> DICOM
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                    {/* File Preview Header */}
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-100 p-2 rounded-lg">
                                <FileImage className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="font-medium text-gray-900 truncate max-w-[200px]">{uploadedFile.name}</p>
                                <p className="text-xs text-gray-500">{formatFileSize(uploadedFile.size)}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleClear}
                            disabled={isUploading}
                            className="text-gray-400 hover:text-red-500 transition-colors p-1"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Image Preview Area */}
                    <div className="h-[300px] bg-gray-900 flex items-center justify-center relative">
                        {imagePreview ? (
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="max-h-full max-w-full object-contain"
                            />
                        ) : (
                            <div className="text-white flex flex-col items-center">
                                <FileText className="w-12 h-12 mb-2 opacity-50" />
                                <p>No preview available for this format</p>
                            </div>
                        )}

                        {/* Overlay Loading State */}
                        {isUploading && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
                                <div className="w-full max-w-xs px-8">
                                    <div className="flex justify-between text-white text-sm mb-2">
                                        <span>Uploading...</span>
                                        <span>{uploadProgress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-700 rounded-full h-2">
                                        <div
                                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${uploadProgress}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="p-4 flex justify-end gap-3">
                        <button
                            onClick={handleClear}
                            disabled={isUploading}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleUpload}
                            disabled={isUploading}
                            className={`
                 px-6 py-2 rounded-lg text-white text-sm font-medium flex items-center gap-2
                 ${isUploading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'}
                 transition-all
               `}
                        >
                            {isUploading ? (
                                'Processing...'
                            ) : (
                                <>
                                    <Upload className="w-4 h-4" /> Upload & Analyze
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-3 border border-red-200">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <p className="text-sm">{error}</p>
                </div>
            )}
        </div>
    );
};

export default ImageUploader;
