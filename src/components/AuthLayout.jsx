import React,{useEffect,useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {useSelector} from 'react-redux'


export default function Protected({children,authentication=true}) {
    const navigate = useNavigate()
    const [loader,setLoader] = useState(true)
    const authStatus= useSelector((state) => state.auth.status)

    useEffect(() => {
        if(authentication && !authStatus){
            // If page requires authentication but user is not logged in
            navigate("/login")
        }else if(!authentication && authStatus){
            // If page is for non-authenticated users but user is logged in
            navigate("/all-posts")
        }
        setLoader(false)
    },[authStatus,navigate,authentication])

  return loader?<h3>Loading...</h3>:<>{children}</>
}

