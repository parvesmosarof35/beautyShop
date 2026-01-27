"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import {
    useGetHeroSectionQuery,
    useUpdateHeroSectionMutation,
} from "@/app/store/api/webContentApi";
import Swal from "sweetalert2";
import { revalidateHero } from "@/app/actions/revalidate";

interface HeroFormValues {
    title: string;
    subtitle: string;
    description: string;
    primaryButtonText: string;
    primaryButtonLink: string;
    secondaryButtonText: string;
    secondaryButtonLink: string;
    backgroundImage: string;
}

export default function WebContentPage() {
    const { data: heroData, isLoading } = useGetHeroSectionQuery({});
    const [updateHeroSection, { isLoading: isUpdating }] = useUpdateHeroSectionMutation();
    const [imageFile, setImageFile] = useState<File | null>(null);

    const form = useForm<HeroFormValues>({
        defaultValues: {
            title: "",
            subtitle: "",
            description: "",
            primaryButtonText: "",
            primaryButtonLink: "",
            secondaryButtonText: "",
            secondaryButtonLink: "",
            backgroundImage: "",
        }
    });

    const { register, handleSubmit, reset } = form;

    useEffect(() => {
        if (heroData?.data) {
            reset({
                title: heroData.data.title || "",
                subtitle: heroData.data.subtitle || "",
                description: heroData.data.description || "",
                primaryButtonText: heroData.data.primaryButtonText || "",
                primaryButtonLink: heroData.data.primaryButtonLink || "",
                secondaryButtonText: heroData.data.secondaryButtonText || "",
                secondaryButtonLink: heroData.data.secondaryButtonLink || "",
                backgroundImage: heroData.data.backgroundImage || "",
            });
        }
    }, [heroData, reset]);

    const onSubmit = async (data: HeroFormValues) => {
        try {
            const formData = new FormData();
            if (imageFile) {
                formData.append('file', imageFile);
            }
            formData.append('data', JSON.stringify({
                title: data.title,
                subtitle: data.subtitle,
                description: data.description,
                primaryButtonText: data.primaryButtonText,
                primaryButtonLink: data.primaryButtonLink,
                secondaryButtonText: data.secondaryButtonText,
                secondaryButtonLink: data.secondaryButtonLink,
                backgroundImage: data.backgroundImage // Keep existing URL if no new file
            }));

            const response = await updateHeroSection(formData).unwrap();

            if (response.success) {
                await revalidateHero(); // Revalidate the Hero tag
                Swal.fire({
                    icon: "success",
                    title: "Updated!",
                    text: "Hero section updated successfully.",
                    background: "#171717",
                    color: "#fff",
                    confirmButtonColor: "#D4A574",
                });
            }
        } catch (error: any) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error?.data?.message || "Failed to update hero section.",
                background: "#171717",
                color: "#fff",
                confirmButtonColor: "#D4A574",
            });
        }
    };

    if (isLoading) {
        return <div className="text-white p-6">Loading content...</div>;
    }

    return (
        <div className="p-6 bg-[#171717] min-h-screen text-white">
            <h1 className="text-2xl font-bold mb-6 font-montserrat text-[#D4A574]">Web Content Management</h1>

            <div className="bg-[#272727] p-6 rounded-lg border border-gray-700">
                <h2 className="text-xl font-semibold mb-4 text-gray-200">Hero Section</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title (HTML Allowed)</Label>
                            <Input
                                id="title"
                                {...register("title")}
                                className="bg-gray-800 border-gray-600 text-white focus:border-[#D4A574]"
                                placeholder="e.g. Elevate Your Beauty <br /> Naturally"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Background Image</Label>
                            <div className="flex items-center gap-4">
                                <div className="relative w-24 h-24 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center overflow-hidden group hover:border-[#D4A574] transition-colors cursor-pointer">
                                    <Input
                                        id="imageFile"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files[0]) {
                                                setImageFile(e.target.files[0]);
                                            }
                                        }}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    {imageFile ? (
                                        <Image
                                            src={URL.createObjectURL(imageFile)}
                                            alt="Preview"
                                            fill
                                            className="object-cover"
                                        />
                                    ) : form.getValues('backgroundImage') ? (
                                        <Image
                                            src={form.getValues('backgroundImage')}
                                            alt="Current"
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <ImageIcon className="text-gray-400 group-hover:text-[#D4A574]" size={24} />
                                    )}
                                </div>
                                <div className="text-sm text-gray-400">
                                    <p>Click box to upload new image</p>
                                    {form.getValues('backgroundImage') && !imageFile && (
                                        <p className="text-xs mt-1 truncate max-w-[200px]">{form.getValues('backgroundImage')}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="subtitle">Subtitle</Label>
                            <Input
                                id="subtitle"
                                {...register("subtitle")}
                                className="bg-gray-800 border-gray-600 text-white focus:border-[#D4A574]"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description (optional)</Label>
                            <Input
                                id="description"
                                {...register("description")}
                                className="bg-gray-800 border-gray-600 text-white focus:border-[#D4A574]"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-700">
                        {/* Primary Button */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-[#D4A574]">Primary Button</h3>
                            <div className="space-y-2">
                                <Label htmlFor="primaryButtonText">Text</Label>
                                <Input
                                    id="primaryButtonText"
                                    {...register("primaryButtonText")}
                                    className="bg-gray-800 border-gray-600 text-white focus:border-[#D4A574]"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="primaryButtonLink">Link</Label>
                                <Input
                                    id="primaryButtonLink"
                                    {...register("primaryButtonLink")}
                                    className="bg-gray-800 border-gray-600 text-white focus:border-[#D4A574]"
                                />
                            </div>
                        </div>

                        {/* Secondary Button */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-[#D4A574]">Secondary Button</h3>
                            <div className="space-y-2">
                                <Label htmlFor="secondaryButtonText">Text</Label>
                                <Input
                                    id="secondaryButtonText"
                                    {...register("secondaryButtonText")}
                                    className="bg-gray-800 border-gray-600 text-white focus:border-[#D4A574]"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="secondaryButtonLink">Link</Label>
                                <Input
                                    id="secondaryButtonLink"
                                    {...register("secondaryButtonLink")}
                                    className="bg-gray-800 border-gray-600 text-white focus:border-[#D4A574]"
                                />
                            </div>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={isUpdating}
                        className="w-full md:w-auto bg-[#D4A574] text-white hover:bg-[#e5b687] font-bold"
                    >
                        {isUpdating ? "Updating..." : "Update Hero Section"}
                    </Button>
                </form>
            </div>
        </div>
    );
}
