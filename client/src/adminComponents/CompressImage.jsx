export const compressImage = async (file, maxSizeKB = 100) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;

            img.onload = () => {
                // Initialize canvas
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                // Set initial dimensions
                let width = img.width;
                let height = img.height;

                // Calculate new dimensions while maintaining aspect ratio
                const maxDimension = 1200;
                if (width > height && width > maxDimension) {
                    height = (height * maxDimension) / width;
                    width = maxDimension;
                } else if (height > maxDimension) {
                    width = (width * maxDimension) / height;
                    height = maxDimension;
                }

                // Set canvas dimensions
                canvas.width = width;
                canvas.height = height;

                // Draw image on canvas
                ctx.drawImage(img, 0, 0, width, height);

                // Convert to WebP with compression
                canvas.toBlob(
                    (blob) => {
                        if (!blob) {
                            reject(new Error('Failed to compress image'));
                            return;
                        }

                        // If the compressed size is still too large, increase compression
                        if (blob.size > maxSizeKB * 1024) {
                            // Try again with more aggressive compression
                            canvas.toBlob(
                                (finalBlob) => {
                                    if (!finalBlob) {
                                        reject(new Error('Failed to compress image'));
                                        return;
                                    }

                                    // Create a new File object with WebP mime type
                                    const compressedFile = new File(
                                        [finalBlob],
                                        `${file.name.split('.')[0]}.webp`,
                                        { type: 'image/webp' }
                                    );

                                    resolve({
                                        file: compressedFile,
                                        preview: URL.createObjectURL(compressedFile)
                                    });
                                },
                                'image/webp',
                                0.5  // More aggressive quality reduction
                            );
                        } else {
                            // Create a new File object with WebP mime type
                            const compressedFile = new File(
                                [blob],
                                `${file.name.split('.')[0]}.webp`,
                                { type: 'image/webp' }
                            );

                            resolve({
                                file: compressedFile,
                                preview: URL.createObjectURL(compressedFile)
                            });
                        }
                    },
                    'image/webp',
                    0.7  // Initial quality setting
                );
            };

            img.onerror = () => {
                reject(new Error('Failed to load image'));
            };
        };

        reader.onerror = () => {
            reject(new Error('Failed to read file'));
        };
    });
};