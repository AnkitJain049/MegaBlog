import React, { useState } from 'react'
import appwriteService from '../appwrite/config'
import { Link } from 'react-router-dom'

function PostCard({$id,title,featuredImage}) {
  const [imageError, setImageError] = useState(false);



  const handleImageError = () => {
    setImageError(true);
    console.error('Failed to load image:', featuredImage);
  };

  return (
    <Link to={`/post/${$id}`}>
        <div className='w-full bg-gray-100 rounded-xl p-4'>
            <div className='w-full justify-center mb-4'>
                {!imageError && featuredImage ? (
                    <img 
                        src={appwriteService.getFilePreview(featuredImage)} 
                        alt={title} 
                        className='rounded-xl w-full h-48 object-cover'
                        onError={handleImageError}
                    />
                ) : (
                    <div className='w-full h-48 bg-gray-300 rounded-xl flex items-center justify-center'>
                        <span className='text-gray-500'>Image not available</span>
                    </div>
                )}
            </div>
            <h2 className='text-xl font-bold'>{title}</h2>
        </div>
    </Link>
  )
}

export default PostCard