import React, { FC, useEffect, useRef } from 'react'

interface props {
    stream: MediaProvider
    peerId: string
    distance: number
}
const VideoScreen: FC<props> = ({ stream, peerId, distance }) => {
    const videoRef = useRef<HTMLVideoElement>()

    const gotRemoteStream = (stream: MediaProvider, peerId: string) => {
        videoRef.current.srcObject = stream
    }

    useEffect(() => gotRemoteStream(stream, peerId), [stream])
    useEffect(() => {
        videoRef.current.volume = distance === 0 ? 1 : 1 / distance
    }, [distance])

    return (
        <div className="flex justify-center content-center items-center center">
            <video
                className="object-cover h-5/6 w-full justify-self-center self-center"
                ref={videoRef}
                autoPlay
            >
                <track kind="captions" srcLang="en" label="english_captions" />
            </video>
        </div>
    )
}

export default VideoScreen
