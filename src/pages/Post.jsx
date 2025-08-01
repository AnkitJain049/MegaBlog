import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";

export default function Post() {
    const [post, setPost] = useState(null);
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);
    const { slug: documentId } = useParams();
    const navigate = useNavigate();

    const userData = useSelector((state) => state.auth.userData);

    const isAuthor = post && userData ? post.userId === userData.$id : false;

    const handleImageError = () => {
        setImageError(true);
    };

    useEffect(() => {
        const fetchPost = async () => {
            if (documentId) {
                try {
                    const postData = await appwriteService.getPost(documentId);
                    if (postData) {
                        setPost(postData);
                        
                        // Check if the featured image file exists
                        if (postData.featuredImage) {
                            const fileExists = await appwriteService.checkFileExists(postData.featuredImage);
                            if (!fileExists) {
                                setImageError(true);
                            }
                        }
                        setImageLoading(false);
                    } else {
                        navigate("/");
                    }
                } catch (error) {
                    navigate("/");
                }
            } else {
                navigate("/");
            }
        };

        fetchPost();
    }, [documentId, navigate]);

    const deletePost = () => {
        appwriteService.deletePost(post.$id).then((status) => {
            if (status) {
                appwriteService.deleteFile(post.featuredImage);
                navigate("/");
            }
        });
    };

    return post ? (
        <div className="py-8">
            <Container>
                <div className="w-full flex justify-center mb-4 relative border rounded-xl p-2">
                    {imageLoading ? (
                        <div className="w-full h-64 bg-gray-200 rounded-xl flex items-center justify-center">
                            <span className="text-gray-500">Loading image...</span>
                        </div>
                    ) : post.featuredImage ? (
                        !imageError ? (
                            <img
                                src={appwriteService.getFilePreview(post.featuredImage)}
                                alt={post.title}
                                className="rounded-xl max-w-full h-auto max-h-96 object-contain"
                                onError={handleImageError}
                            />
                        ) : (
                            <div className="w-full h-64 bg-gray-300 rounded-xl flex items-center justify-center">
                                <div className="text-center">
                                    <span className="text-gray-500 block">Image not available</span>
                                    <span className="text-xs text-gray-400 mt-1">File ID: {post.featuredImage}</span>
                                    <span className="text-xs text-gray-400 block">File may have been deleted</span>
                                </div>
                            </div>
                        )
                    ) : (
                        <div className="w-full h-64 bg-gray-300 rounded-xl flex items-center justify-center">
                            <span className="text-gray-500">No image uploaded</span>
                        </div>
                    )}

                    {isAuthor && (
                        <div className="absolute right-6 top-6">
                            <Link to={`/edit-post/${post.$id}`}>
                                <Button bgColor="bg-green-500" className="mr-3">
                                    Edit
                                </Button>
                            </Link>
                            <Button bgColor="bg-red-500" onClick={deletePost}>
                                Delete
                            </Button>
                        </div>
                    )}
                </div>
                <div className="w-full mb-6">
                    <h1 className="text-2xl font-bold">{post.title}</h1>
                </div>
                <div className="browser-css">
                    {parse(post.content)}
                    </div>
            </Container>
        </div>
    ) : null;
}