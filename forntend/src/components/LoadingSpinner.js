import React from 'react'
import "./loadingspinner.css"

export default function LoadingSpinner() {
  return (
    <>
        <div className='overlay'></div>
        <div className="lds-ring main"><div></div><div></div><div></div><div></div></div>
    </>
  )
}
