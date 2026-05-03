'use client';

import React, { useRef, useState, useCallback } from 'react';
import { Camera, Loader2, X, Upload } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadProfileImage } from '@/services/profileApi';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import Image from 'next/image';

interface ProfileImageUploadProps {
    currentAvatarUrl?: string;
    userName?: string;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

export default function ProfileImageUpload({ currentAvatarUrl, userName }: ProfileImageUploadProps) {
    const [preview, setPreview] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const queryClient = useQueryClient();
    const { updateUser } = useAuthStore();

    const uploadMutation = useMutation({
        mutationFn: uploadProfileImage,
        onSuccess: (data) => {
            // Update auth store with new avatar
            updateUser({ avatarUrl: data.avatarUrl });
            // Invalidate profile queries
            queryClient.invalidateQueries({ queryKey: ['my-profile'] });
            setPreview(null);
            toast.success('Profile image updated successfully!');
        },
        onError: (error: any) => {
            toast.error(error?.response?.data?.message || 'Failed to upload image');
        },
    });

    const validateFile = (file: File): string | null => {
        if (!ALLOWED_TYPES.includes(file.type)) {
            return 'Please upload a valid image file (JPG, PNG, GIF, or WebP)';
        }
        if (file.size > MAX_FILE_SIZE) {
            return 'File size must be less than 5MB';
        }
        return null;
    };

    const handleFileSelect = useCallback((file: File) => {
        const error = validateFile(file);
        if (error) {
            toast.error(error);
            return;
        }

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Upload immediately
        uploadMutation.mutate(file);
    }, [uploadMutation]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const cancelPreview = () => {
        setPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const displayImage = preview || currentAvatarUrl;
    const initials = userName?.charAt(0).toUpperCase() || '?';

    return (
        <div className="flex flex-col items-center gap-4">
            {/* Avatar Container */}
            <div
                onClick={handleClick}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
          relative w-28 h-28 rounded-full cursor-pointer
          group transition-all duration-300
          ${isDragging ? 'ring-4 ring-emerald-500/50 scale-105' : ''}
          ${uploadMutation.isPending ? 'pointer-events-none' : ''}
        `}
            >
                {/* Avatar Image or Initials */}
                <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-emerald-600 to-emerald-800 border-4 dark:border-zinc-800 border-white">
                    {displayImage ? (
                        <Image
                            src={displayImage}
                            alt="Profile"
                            fill
                            className="object-cover"
                            unoptimized={preview !== null}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <span className="text-3xl font-bold text-white">{initials}</span>
                        </div>
                    )}
                </div>

                {/* Hover Overlay */}
                {!uploadMutation.isPending && (
                    <div className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="text-center">
                            <Camera className="w-6 h-6 text-white mx-auto mb-1" />
                            <span className="text-xs text-white font-medium">Change</span>
                        </div>
                    </div>
                )}

                {/* Loading Overlay */}
                {uploadMutation.isPending && (
                    <div className="absolute inset-0 rounded-full bg-black/70 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
                    </div>
                )}

                {/* Cancel Preview Button */}
                {preview && !uploadMutation.isPending && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            cancelPreview();
                        }}
                        className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Instructions */}
            <div className="text-center">
                <p className="text-xs dark:text-zinc-500 text-zinc-600">
                    Click or drag to upload
                </p>
                <p className="text-xs dark:text-zinc-600 text-zinc-500 mt-0.5">
                    JPG, PNG, GIF or WebP • Max 5MB
                </p>
            </div>

            {/* Hidden File Input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleInputChange}
                className="hidden"
            />
        </div>
    );
}
