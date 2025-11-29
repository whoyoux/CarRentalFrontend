import React from 'react'

const RentPageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='max-w-xl mx-auto w-full'>{children}</div>
  )
}

export default RentPageLayout