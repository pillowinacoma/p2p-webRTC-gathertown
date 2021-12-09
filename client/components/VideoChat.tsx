import React, { FC, useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useAppSelector } from '../hooks'
import { setStream } from '../slices/boardSlice'
import { AppDispatch } from '../store'

const VideoChat: FC = () => {
    const [startAvailable, setStart] = useState(true)
    const [callAvailable, setCall] = useState(false)
    const [hangupAvailable, setHangup] = useState(false)

    const localVideoRef = useRef<HTMLVideoElement>()
    const remoteVideoRef = useRef<HTMLVideoElement>()

    const dispatch = useDispatch<AppDispatch>()
    const localStream = useAppSelector((state) => state.stream)
    const remoteStream = useAppSelector((state) => state.remoteStream)

    const gotStream = (stream: MediaProvider) => {
        localVideoRef.current.srcObject = stream
        return stream
    }
    const gotRemoteStream = (remoteStream: MediaProvider) => {
        remoteVideoRef.current.srcObject = remoteStream
        return remoteStream
    }
    useEffect(() => {
        gotRemoteStream(remoteStream)
    }, [remoteStream])

    const start = () => {
        const videoStream = navigator.mediaDevices
            .getUserMedia({
                audio: true,
                video: true,
            })
            .then(gotStream)
            .then((stream) => {
                dispatch(setStream(stream, true))
            })
            .catch((e) => {
                console.log(e)
                alert('getUserMedia() error:' + e.name)
            })
        gotStream(localStream)
        return videoStream
    }
    const call = async () => {
        const st = await start()

        // TODO voir la doc de simple-peer

        setCall(false)
        setHangup(true)
    }
    return (
        <>
            <div>
                <video ref={localVideoRef} autoPlay muted>
                    <track
                        kind="captions"
                        srcLang="en"
                        label="english_captions"
                    />
                </video>
                <video ref={remoteVideoRef} autoPlay muted>
                    <track
                        kind="captions"
                        srcLang="en"
                        label="english_captions"
                    />
                </video>
            </div>
            <button onClick={() => call()}>start</button>
        </>
    )
}
export default VideoChat
