import React from 'react'
import Navbar from '../components/home-page-components/Navbar'

import Image from 'next/image';

const confusedGoku = "/dokkanIcons/goku_confused.jpg";


export default function NoPage() {
  return (
    <>
    <Navbar />
    <div className='flex justify-center items-center'>
      <div>
        <p className='text-4xl font-bold'>404</p>
        <p className='text-lg font-bold'>This page does not exist</p>
        <p className='text-lg font-bold'>click the logo to redirect to the home page</p>
      </div>
    </div>
    </>
  )
}
