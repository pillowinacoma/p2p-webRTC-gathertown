import React, { FC, MutableRefObject, useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { useAppSelector } from '../hooks'
import { breakStream, setStream } from '../slices/boardSlice'
import { AppDispatch } from '../store'
import VideoScreen from './VideoScreen'

const VideoBar: FC = () => {
    const localVideoRef = useRef<HTMLVideoElement>()

    const dispatch = useDispatch<AppDispatch>()
    const localStream = useAppSelector((state) => state.stream)
    const remoteStreams = useAppSelector((state) => state.remoteStreams)

    const gotStream = (stream: MediaProvider) => {
        if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream
        }
        return stream
    }

    const start = async () =>
        await navigator.mediaDevices
            .getUserMedia({
                audio: true,
                video: true,
            })
            .then((stream) => {
                dispatch(setStream(stream, true))
                return stream
            })
            .catch((e) => {
                console.log(e)
                alert('getUserMedia() error:' + e.name)
            })

    const cut = () => {
        localStream && dispatch(breakStream(localStream, true))
    }

    useEffect(() => {
        gotStream(localStream)
    }, [localStream])

    useEffect(() => {
        start()
    }, [localVideoRef])

    return (
        <>
            <div>
                <div>
                    Moi
                    <video ref={localVideoRef} autoPlay muted>
                        <track
                            kind="captions"
                            srcLang="en"
                            label="english_captions"
                        />
                    </video>
                </div>
                <div>
                    Autrui
                    {Object.entries(remoteStreams).map(([peerId, stream]) => (
                        <VideoScreen
                            peerId={peerId}
                            stream={stream}
                            key={`VideoScreen-${peerId}`}
                        />
                    ))}
                </div>
            </div>
        </>
    )
}
export default VideoBar
