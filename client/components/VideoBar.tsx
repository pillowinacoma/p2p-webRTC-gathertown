import { mapValues } from 'lodash'
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
    const connectedTo = useAppSelector((state) => state.connectedTo)
    const distances = useAppSelector((state) => state.distances)
    const remoteStreams = useAppSelector((state) =>
        mapValues(state.remote, ({ stream }) => stream)
    )
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
        <div className="item flex flex-col w-full order-3 flex-shrink">
            <div className="h-1/3 content-start w-full flex justify-center">
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
            <div className="grid grid-cols-3 auto-rows-min overflow-y-auto">
                {Object.entries(remoteStreams).map(
                    ([peerId, stream], idx) =>
                        connectedTo[peerId] && (
                            <VideoScreen
                                peerId={peerId}
                                stream={stream}
                                key={`VideoScreen-${peerId}`}
                                distance={distances[peerId]}
                            />
                        )
                )}
            </div>
        </div>
    )
}
export default VideoBar
