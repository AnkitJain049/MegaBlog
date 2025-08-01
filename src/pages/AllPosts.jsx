import React, {useState, useEffect} from 'react'
import { Container, PostCard } from '../components'
import appwriteService from "../appwrite/config";

function AllPosts() {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true)
                const postsData = await appwriteService.getPosts([])
                if (postsData) {
                    setPosts(postsData.documents)
                } else {
                    setError("Failed to fetch posts")
                }
            } catch (error) {
                setError("Failed to fetch posts")
            } finally {
                setLoading(false)
            }
        }

        fetchPosts()
    }, [])
  return (
    <div className='w-full py-8'>
        <Container>
            {loading && <div className="text-center py-8">Loading posts...</div>}
            {error && <div className="text-center py-8 text-red-500">{error}</div>}
            {!loading && !error && (
                <div className='flex flex-wrap'>
                    {posts.map((post) => (
                        <div key={post.$id} className='p-2 w-1/4'>
                            <PostCard {...post} />
                        </div>
                    ))}
                </div>
            )}
        </Container>
    </div>
  )
}

export default AllPosts