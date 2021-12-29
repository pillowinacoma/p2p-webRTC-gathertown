import React, { FC, useEffect, useRef } from 'react'

interface props {
    stream: MediaProvider
    peerId: string
}
const VideoScreen: FC<props> = ({ stream, peerId }) => {
    const videoRef = useRef<HTMLVideoElement>()

    const gotRemoteStream = (stream: MediaProvider, peerId: string) => {
        videoRef.current.srcObject = stream
    }

    useEffect(() => gotRemoteStream(stream, peerId), [stream])

    return (
        <div>
            <video ref={videoRef} autoPlay>
                <track kind="captions" srcLang="en" label="english_captions" />
            </video>
        </div>
    )
}

export default VideoScreen
