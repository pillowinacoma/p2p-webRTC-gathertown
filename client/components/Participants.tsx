import { toPairs } from 'lodash'
import React, { FC, useState } from 'react'
import { useAppSelector } from '../hooks'
import Participant from './Participant'

const Participants: FC = () => {
    const remote = useAppSelector((state) => state.remote)

    const remotePlayersDisplay = toPairs(remote).map(([peerId], idx) => {
        return (
            <div key={peerId}>
                <Participant peerId={peerId} idx={idx} />
            </div>
        )
    })

    return (
        <div className="top-0 flex flex-row overflow-x-auto text-gray-100 ">
            <div className="border-gray-400 border-2 h-12 w-12 p-0  content-center rounded-md ">
                <span>...</span>
            </div>
            {remotePlayersDisplay}
        </div>
    )
}

export default Participants
