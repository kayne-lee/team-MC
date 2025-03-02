import React from 'react'

export default function Loader() {
  return (
    <div className="flex flex-row justify-center items-center h-full w-full">
        <div className="w-12 h-12 rounded-full border-4 border-purple-200 border-t-purple-500 animate-spin"></div>
    </div>
  )
}
