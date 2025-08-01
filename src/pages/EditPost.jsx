import React, {useEffect, useState} from 'react'
import {Container, PostForm} from '../components'
import appwriteService from "../appwrite/config";
import { useNavigate, useParams } from 'react-router-dom';

function EditPost() {
    const [post, setPost] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const {slug: documentId} = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        const fetchPost = async () => {
            if (documentId) {
                try {
                    setLoading(true)
                    const postData = await appwriteService.getPost(documentId)
                    if (postData) {
                        setPost(postData)
                    } else {
                        setError("Post not found")
                        navigate('/')
                    }
                } catch (error) {
                    setError("Failed to fetch post")
                    navigate('/')
                } finally {
                    setLoading(false)
                }
            } else {
                navigate('/')
            }
        }

        fetchPost()
    }, [documentId, navigate])

    if (loading) {
        return (
            <div className='py-8'>
                <Container>
                    <div className="text-center">Loading post...</div>
                </Container>
            </div>
        )
    }

    if (error) {
        return (
            <div className='py-8'>
                <Container>
                    <div className="text-center text-red-500">{error}</div>
                </Container>
            </div>
        )
    }

    return post ? (
        <div className='py-8'>
            <Container>
                <PostForm post={post} />
            </Container>
        </div>
    ) : null
}

export default EditPost