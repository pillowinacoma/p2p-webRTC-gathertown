import {
    Card,
    CardBody,
    TableContainer,
    Table,
    TableBody,
    TableRow,
    TableCell,
} from '@windmill/react-ui'
import React, { FC, useState } from 'react'
import { useAppSelector } from '../hooks'
import alex from '../img/Alex.png'
import bob from '../img/Bob.png'
import adam from '../img/Adam.png'
import amelia from '../img/Amelia.png'

interface props {
    peerId: string
    idx: number
}
const avatars: { [key: string]: any } = {
    Alex: alex,
    Amelia: amelia,
    Bob: bob,
    Adam: adam,
}
const Participant: FC<props> = ({ peerId, idx }) => {
    const [hide, setHide] = useState(true)
    const remoteAvatars = useAppSelector((state) => state.remoteAvatars)
    const remotePositions = useAppSelector((state) => state.remotePositions)
    const distances = useAppSelector((state) => state.distances)
    return (
        <>
            <button
                onMouseEnter={() => setHide(false)}
                onMouseLeave={() => setHide(true)}
            >
                {idx}
            </button>
            {!hide && (
                <div className="absolute m-3">
                    <Card>
                        <CardBody>
                            <TableContainer>
                                <Table>
                                    <TableBody>
                                        {remoteAvatars[peerId] && (
                                            <TableRow>
                                                <TableCell>Avatar</TableCell>
                                                <TableCell>
                                                    <img
                                                        src={
                                                            avatars[
                                                                remoteAvatars[
                                                                    peerId
                                                                ]
                                                            ]
                                                        }
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        )}
                                        <TableRow>
                                            <TableCell>Peer ID</TableCell>
                                            <TableCell>{peerId}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Position</TableCell>
                                            <TableCell>
                                                {remotePositions[peerId][0]},{' '}
                                                {remotePositions[peerId][0]}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>distance</TableCell>
                                            <TableCell>
                                                {distances[peerId]}
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardBody>
                    </Card>
                </div>
            )}
        </>
    )
}

export default Participant
