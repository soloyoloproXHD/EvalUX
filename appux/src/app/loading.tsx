'use client'

import React from 'react'

const Loanding = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-transparent  bg-opacity-75 z-50">
            <div className="flex-col gap-4 w-full flex items-center justify-center">
                <div
                    className="w-20 h-20 border-4 border-transparent text-blue-400 text-4xl animate-spin flex items-center justify-center border-t-blue-400 rounded-full"
                >
                    <div
                        className="w-16 h-16 border-4 border-transparent text-red-400 text-2xl animate-spin flex items-center justify-center border-t-red-400 rounded-full"
                    ></div>
                </div>
            </div>

        </div>
    )
}

export default Loanding