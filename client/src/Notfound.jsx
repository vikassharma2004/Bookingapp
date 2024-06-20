import React from 'react'
import { Link } from 'react-router-dom'

const Notfound = () => {
  return (
    <Link to={'/'} className='flex justify-center align-center'><img src="public/notfound.png" alt="" className='object-cover ' /></Link>
  )
}

export default Notfound