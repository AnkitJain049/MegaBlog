import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, Select, RTE } from "../index";
import appwriteservice from "../../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PostForm({ post }) {
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState("");

    const { register, handleSubmit, watch, setValue, control, getValues, formState: { errors } } =
        useForm({
        defaultValues: {
            title: post?.title || "",
            content: post?.content || "",
            status: post?.status || "active",
        },
        });
    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);

    const submit = async (data) => {
        setLoading(true);
        setError("");
        
        try {
            if (post) {
                // Update existing post
                let newFeaturedImage = post.featuredImage; // Keep existing image by default
                
                if (data.image[0]) {
                    // New image uploaded
                    const file = await appwriteservice.uploadFile(data.image[0]);
                    if (file) {
                        // Delete old image if it exists
                        if (post.featuredImage) {
                            appwriteservice.deleteFile(post.featuredImage);
                        }
                        newFeaturedImage = file.$id;
                    } else {
                        setError("Failed to upload new image");
                        setLoading(false);
                        return;
                    }
                }

                const dbPost = await appwriteservice.updatePost(post.$id, {
                    title: data.title,
                    content: data.content,
                    status: data.status,
                    featuredImage: newFeaturedImage,
                });
                
                if (dbPost) {
                    // Navigate to the updated post using the document ID
                    navigate(`/post/${dbPost.$id}`);
                } else {
                    setError("Failed to update post");
                }

            } else {
                // Create new post
                if (!data.image[0]) {
                    setError("Please select a featured image");
                    setLoading(false);
                    return;
                }

                const file = await appwriteservice.uploadFile(data.image[0]);
                if (file) {
                    const dbPost = await appwriteservice.createPost({
                        title: data.title,
                        content: data.content,
                        status: data.status,
                        featuredImage: file.$id,
                        userId: userData.$id,
                    });

                    if (dbPost) {
                        navigate(`/post/${dbPost.$id}`);
                    } else {
                        setError("Failed to create post");
                    }
                } else {
                    setError("Failed to upload image");
                }
            }
        } catch (error) {
            setError(error.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };



  return (
        <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
            {error && (
                <div className="w-full mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}
            <div className="w-2/3 px-2">
                <Input
                    label="Title :"
                    placeholder="Title"
                    className="mb-4"
                    {...register("title", { required: true })}
                />
                <RTE label="Content :" name="content" control={control} defaultValue={getValues("content")} />
            </div>
            <div className="w-1/3 px-2">
                <Input
                    label="Featured Image :"
                    type="file"
                    className="mb-4"
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    {...register("image", { required: !post })}
                />
                {post && post.featuredImage && (
                    <div className="w-full mb-4">
                        <img
                            src={appwriteservice.getFilePreview(post.featuredImage)}
                            alt={post.title}
                            className="rounded-lg w-full h-32 object-cover"
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                            }}
                        />
                        <div className="w-full h-32 bg-gray-300 rounded-lg flex items-center justify-center" style={{display: 'none'}}>
                            <span className="text-gray-500">Current image</span>
                        </div>
                    </div>
                )}
                <Select
                    options={["active", "inactive"]}
                    label="Status"
                    className="mb-4"
                    {...register("status", { required: true })}
                />
                <Button 
                    type="submit" 
                    bgColor={post ? "bg-green-500" : undefined} 
                    className="w-full"
                    disabled={loading}
                >
                    {loading ? "Processing..." : (post ? "Update" : "Submit")}
                </Button>
            </div>
        </form>
    );
}