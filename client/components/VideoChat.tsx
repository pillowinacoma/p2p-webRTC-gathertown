import React, { FC, useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useAppSelector } from '../hooks'
import { breakStream, setStream } from '../slices/boardSlice'
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

    const distance = useAppSelector((state) => state.distance)

    const gotStream = (stream: MediaProvider) => {
        localVideoRef.current.srcObject = stream
        return stream
    }
    const gotRemoteStream = (remoteStream: MediaProvider) => {
        remoteVideoRef.current.srcObject = remoteStream
        return remoteStream
    }

    const start = async () => {
        const videoStream = await navigator.mediaDevices
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
        return videoStream
    }
    const call = async () => {
        const st = await start()

        // TODO voir la doc de simple-peer

        setCall(false)
        setHangup(true)
    }
    const cut = () => {
        dispatch(breakStream(localStream, true))
    }

    useEffect(() => {
        console.log(remoteStream)

        gotRemoteStream(remoteStream)
    }, [remoteStream])
    useEffect(() => {
        gotStream(localStream)
    }, [localStream])
    useEffect(() => {
        if (distance < 2) {
            call()
        } else if (distance > 5) {
            cut()
        }
    }, [distance])

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
                    <video ref={remoteVideoRef} autoPlay>
                        <track
                            kind="captions"
                            srcLang="en"
                            label="english_captions"
                        />
                    </video>
                </div>
            </div>
        </>
    )
}
export default VideoChat
