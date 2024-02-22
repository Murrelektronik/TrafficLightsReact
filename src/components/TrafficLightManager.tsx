import {Box, Button, IconButton, Typography} from '@mui/material';
import {useState} from 'react';
import {TrafficLight} from './TrafficLight';
import {useTrafficLightManager} from '../hooks/useTrafficLightManager';
import AdjustIcon from '@mui/icons-material/Adjust';

export const TrafficLightManager = (): JSX.Element => {
    const [start, setStart] = useState<boolean>(false);
    const [pedestrianRequest, setPedestrianRequest] = useState<boolean>(false);

    const {startMain, startSide, startPedestrian, setMainFinished, setSideFinished, setPedestrianFinished} =
        useTrafficLightManager({
            start,
            pedestrianRequest,
        });
    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateColumns: 'auto repeat(14, 60px) auto',
                gridTemplateRows: '20px 50px 40px 50px 20px repeat(13, 50px)',
                gap: '0px',
                backgroundColor: '#ddd',
                padding: '10px',
                maxWidth: 1000,
                maxHeight: 830,
                minWidth: 1000,
                minHeight: 740,
            }}
        >
            <Typography variant='h3' align='center' sx={{gridColumn: '1 / 17', gridRow: '2'}}>
                Traffic Lights Demo
            </Typography>
            <Box
                sx={{
                    backgroundColor: '#999',
                    gridColumn: '8 / span 2',
                    gridRow: '6 / span 13',
                }}
            />

            <Box
                sx={{
                    backgroundColor: '#999',
                    gridColumn: '1 / span 16',
                    gridRow: '10 / span 2',
                }}
            />
            <Box
                sx={{
                    mx: 1.2,
                    backgroundColor: '#999',
                    gridColumn: '1 / span 16',
                    gridRow: '11',
                    height: '1px',
                    backgroundImage: 'repeating-linear-gradient(to right, white, white 25px, #999 25px, #999 50px)',
                }}
            />
            <Box
                sx={{
                    backgroundColor: '#999',
                    gridColumn: '9 / span 2',
                    gridRow: '6 / span 13',
                    width: '1px',
                    mt: 1.2,
                    backgroundImage: 'repeating-linear-gradient(to bottom, white, white 25px, #999 25px, #999 50px)',
                }}
            />
            <Box
                sx={{
                    gridColumn: '13 / span 3',
                    gridRow: '10 / span 2',
                    backgroundImage: 'repeating-linear-gradient(to bottom, white, white 12px, #999 12px, #999 30px)',
                    border: '1px solid white',
                }}
            />
            <Button variant='contained' onClick={() => setStart(!start)} sx={{gridRow: '4', gridColumn: '2 / span 2'}}>
                Start
            </Button>
            <IconButton
                size='small'
                color='primary'
                onClick={() => setPedestrianRequest(!pedestrianRequest)}
                sx={{
                    alignSelf: 'flex-start',
                    justifySelf: 'center',
                    gridRow: '9',
                    gridColumn: '14',
                    maxWidth: '20px',
                    maxHeight: '20px',
                }}
            >
                <AdjustIcon />
            </IconButton>

            <TrafficLight
                sx={{ml: 2.5, gridRow: '8 / span 2', gridColumn: '6 / span 1', transform: 'rotate(90deg)'}}
                start={startMain}
                done={() => {
                    console.log('TL1 done');
                    setMainFinished(true);
                }}
            />
            <TrafficLight
                sx={{ml: 1, mt: 1, gridRow: '12 / span 2', gridColumn: '10 / span 1'}}
                start={startSide}
                done={() => {
                    console.log('TL2 done');
                    setSideFinished(true);
                }}
            />
            <TrafficLight
                sx={{ml: 1, mt: 1, gridRow: '7 / span 2', gridColumn: '14 / span 1'}}
                start={startPedestrian}
                pedestrian
                done={() => {
                    console.log('PL done');
                    setPedestrianFinished(true);
                }}
            />
        </Box>
    );
};
