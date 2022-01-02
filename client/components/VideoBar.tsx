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

    return (
        <div className="item flex flex-col w-full">
            <div className="flex justify-around content-center">
                <button className="w-full" onClick={() => start()}>
                    Stream
                </button>
                <button className="w-full" onClick={() => cut()}>
                    Cut
                </button>
            </div>
            <div className="flex flex-col">
                <div className="h-1/5 content-start h-auto flex justify-center content-center">
                    <video
                        className="h-full w-full object-cover"
                        ref={localVideoRef}
                        autoPlay
                        muted
                    >
                        <track
                            kind="captions"
                            srcLang="en"
                            label="english_captions"
                        />
                    </video>
                </div>
                <div className="grid grid-cols-3 auto-rows-min h-full">
                    {Object.entries(remoteStreams).map(
                        ([peerId, stream], idx) => (
                            <VideoScreen
                                shrinkIdx={idx + 1}
                                peerId={peerId}
                                stream={stream}
                                key={`VideoScreen-${peerId}`}
                            />
                        )
                    )}
                </div>
            </div>
        </div>
    )
}
export default VideoBar
