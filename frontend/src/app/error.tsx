'use client'

const error = ({ error, reset }: { error: Error; reset: () => void }) => {
    return (
        <div>
            <h1>Error</h1>
        </div>
    )
}

export default error