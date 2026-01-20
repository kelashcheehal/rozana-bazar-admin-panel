import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const useProductForm = (initialData = null) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [previews, setPreviews] = useState(Array(6).fill(null));
    const [imageFiles, setImageFiles] = useState(Array(6).fill(null));

    // Color state
    const [colorName, setColorName] = useState("");
    const [colorHex, setColorHex] = useState("#000000");
    const [colorPreview, setColorPreview] = useState(null);
    const [colorFile, setColorFile] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        brand: "",
        description: "",
        category: "",
        price: "",
        discount: "",
        stock: "",
        sku: "",
        materials: [],
        sizes: [],
        colors: [],
        care_instructions: "",
        status: "live",
    });

    // Populate form if initialData is provided (Edit Mode)
    useEffect(() => {
        if (initialData) {
            const safeParse = (data) => {
                if (Array.isArray(data)) return data;
                if (typeof data === "string") {
                    try { return JSON.parse(data); } catch { return []; }
                }
                return [];
            };

            const image_urls = safeParse(initialData.image_urls);

            // Map colors to internal format if needed
            const rawColors = safeParse(initialData.colors);
            const colors = rawColors.map(c => ({
                name: c.name,
                hex_code: c.hex_code || "#000000",
                image_url: c.image_url,
                preview: c.image_url // Use URL as preview for existing
            }));

            setFormData({
                name: initialData.name || "",
                brand: initialData.brand || "",
                description: initialData.description || "",
                category: initialData.category || "",
                price: initialData.price || "",
                discount: initialData.discount || "",
                stock: initialData.stock || "",
                sku: initialData.sku || "",
                materials: safeParse(initialData.materials),
                sizes: safeParse(initialData.sizes),
                colors: colors,
                care_instructions: initialData.care_instructions || "",
                status: initialData.status || "draft",
            });

            // Handle existing main images
            const newPreviews = Array(6).fill(null);
            image_urls.forEach((url, index) => {
                if (index < 6) newPreviews[index] = url;
            });
            setPreviews(newPreviews);
        }
    }, [initialData]);

    // Categories & Options
    const CATEGORIES = [
        "T-Shirts", "Shirts", "Pants", "Jeans", "Shorts", "Jackets", "Sweaters",
        "Dresses", "Skirts", "Activewear", "Swimwear", "Underwear", "Socks",
        "Accessories", "Shoes"
    ];
    const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
    const MATERIALS = [
        "Cotton", "Polyester", "Wool", "Silk", "Linen", "Denim", "Leather",
        "Spandex", "Nylon", "Rayon", "Cashmere", "Velvet"
    ];

    // --- Handlers ---

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSizeChange = (size) => {
        setFormData((prev) => {
            const newSizes = prev.sizes.includes(size)
                ? prev.sizes.filter((s) => s !== size)
                : [...prev.sizes, size];
            return { ...prev, sizes: newSizes };
        });
    };

    const handleMaterialChange = (material) => {
        setFormData((prev) => {
            const newMaterials = prev.materials.includes(material)
                ? prev.materials.filter((m) => m !== material)
                : [...prev.materials, material];
            return { ...prev, materials: newMaterials };
        });
    };

    // Image Upload Logic
    const handleImageChange = async (e, index) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please upload only image files");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image size should be less than 5MB");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const newPreviews = [...previews];
            newPreviews[index] = reader.result;
            setPreviews(newPreviews);

            const newImageFiles = [...imageFiles];
            newImageFiles[index] = file;
            setImageFiles(newImageFiles);
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveImage = (index) => {
        const newPreviews = [...previews];
        newPreviews[index] = null;
        setPreviews(newPreviews);

        const newImageFiles = [...imageFiles];
        newImageFiles[index] = null;
        setImageFiles(newImageFiles);

        // If it was an existing image (string URL), we might need to handle deletion logic or just ignore
        // For now, removing it from form state is enough for update
    };

    // Color Logic
    const handleColorImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please upload only image files");
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            toast.error("Color image size should be less than 2MB");
            return;
        }

        setColorFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setColorPreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleAddColor = () => {
        if (!colorName.trim()) {
            toast.error("Please enter a color name");
            return;
        }
        // For edit mode, we might want to allow adding color without image if just editing text? 
        // But let's keep it strict for now or check if it's a new color
        if (!colorFile && !colorPreview) {
            // Logic to allow simple colors without images could go here
            toast.error("Please upload a color image");
            return;
        }

        const colorExists = formData.colors.some(
            (color) => color.name.toLowerCase() === colorName.toLowerCase()
        );

        if (colorExists) {
            toast.error("This color already exists");
            return;
        }

        const newColor = {
            name: colorName.trim(),
            hex_code: colorHex,
            imageFile: colorFile,
            preview: colorPreview,
            // If no file, verify if it's just a visual blob or existing URL
        };

        setFormData((prev) => ({
            ...prev,
            colors: [...prev.colors, newColor],
        }));

        setColorName("");
        setColorHex("#000000");
        setColorPreview(null);
        setColorFile(null);
    };

    const handleRemoveColor = (index) => {
        setFormData((prev) => ({
            ...prev,
            colors: prev.colors.filter((_, i) => i !== index),
        }));
    };

    // Submission Helpers
    const uploadToStorage = async (file, path) => {
        // ... logic reuse ...
        const { data, error } = await supabase.storage
            .from("product-images")
            .upload(path, file, { cacheControl: "3600", upsert: false });

        if (error) throw error;
        const { data: urlData } = supabase.storage
            .from("product-images")
            .getPublicUrl(data.path);
        return urlData.publicUrl;
    };

    const generateFileName = (originalName) => {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 15);
        const extension = originalName.split(".").pop();
        return `${timestamp}-${random}.${extension}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!formData.name.trim()) throw new Error("Product name is required");
            if (!formData.price) throw new Error("Price is required");

            // 1. Upload new Main Images
            const finalImageUrls = [];

            // If editing, start with existing URLs that weren't removed
            // We need to map previews back to their source. 
            // Simplified: If preview is a string (url), keep it. If it's a blob (file), upload it.

            for (let i = 0; i < 6; i++) {
                const file = imageFiles[i];
                const preview = previews[i];

                if (file) {
                    // New file to upload
                    const fileName = generateFileName(file.name);
                    const path = `product-images/${fileName}`;
                    const url = await uploadToStorage(file, path);
                    finalImageUrls.push(url);
                } else if (typeof preview === "string" && preview.startsWith("http")) {
                    // Existing URL
                    finalImageUrls.push(preview);
                }
            }

            // 2. Upload new Color Images
            const finalColorsData = [];
            for (const color of formData.colors) {
                let imageUrl = color.image_url; // Existing

                if (color.imageFile) {
                    const fileName = generateFileName(color.imageFile.name);
                    const path = `product-images/colors-images/${fileName}`;
                    imageUrl = await uploadToStorage(color.imageFile, path);
                }

                finalColorsData.push({
                    name: color.name,
                    hex_code: color.hex_code || "#000000",
                    image_url: imageUrl || color.preview // Fallback if needed, but should be URL
                });
            }

            const price = parseFloat(formData.price) || 0;
            const discount = parseFloat(formData.discount) || 0;
            const discountPrice = price - (price * discount / 100);

            const productPayload = {
                name: formData.name.trim(),
                brand: formData.brand.trim(),
                description: formData.description.trim(),
                category: formData.category,
                sku: formData.sku.trim(),
                price: price,
                discount: discount,
                discount_price: discountPrice,
                stock: parseInt(formData.stock) || 0,
                materials: formData.materials,
                sizes: formData.sizes,
                colors: finalColorsData,
                image_urls: finalImageUrls,
                care_instructions: formData.care_instructions.trim(),
                status: formData.status,
            };

            let error;
            if (initialData?.id) {
                // UPDATE
                const { error: updateError } = await supabase
                    .from("products")
                    .update(productPayload)
                    .eq("id", initialData.id);
                error = updateError;
                toast.success("Product updated successfully!");
                router.push("/dashboard/products"); // Redirect on edit success
            } else {
                // INSERT
                const { error: insertError } = await supabase
                    .from("products")
                    .insert([productPayload]);
                error = insertError;
                toast.success("Product created successfully!");
                // Optional: Reset form or redirect
                setFormData({ ...formData, name: "" }); // partial reset or router.push
                router.push("/dashboard/products");
            }

            if (error) throw error;

        } catch (error) {
            console.error("Error saving product:", error);
            toast.error(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return {
        formData,
        loading,
        previews,
        colorName, setColorName,
        colorHex, setColorHex,
        colorPreview,
        imageFiles,

        handleInputChange,
        handleSelectChange,
        handleSizeChange,
        handleMaterialChange,
        handleImageChange,
        handleColorImageChange,
        handleAddColor,
        handleRemoveColor,
        handleRemoveImage,
        handleSubmit,

        CATEGORIES,
        SIZE_OPTIONS,
        MATERIALS
    };
};
