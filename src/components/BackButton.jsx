import React from 'react'

export default function BackButton({ label, onClick, className, ...props }) {
    return (
        <button className={className} onClick={onClick} {...props}>
            {label}
        </button>
    )
}
