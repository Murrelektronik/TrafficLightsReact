import {Box, SxProps} from '@mui/material';
import {TrafficLightElement} from './TrafficLightElement';
import {useTrafficLight} from '../hooks/useTrafficLight';
import {useEffect} from 'react';

export type TrafficLightProps = {
    start: boolean;
    done: () => void;
    pedestrian?: boolean;
    sx?: SxProps;
};

export const TrafficLight = (props: TrafficLightProps): JSX.Element => {
    const {start, done: setDone, pedestrian, sx} = props;
    const {red = false, yellow = false, green = false, done, setRun} = useTrafficLight({pedestrian});

    useEffect(() => {
        setRun(start);
    }, [start]);

    useEffect(() => {
        if (done) {
            setDone();
        }
    }, [done]);
    const heightCenterElement: string = pedestrian ? '0px' : 'auto';
    const defaultPadding: string = '10px';
    const defaultGap: string = '5px';
    const padding: string = pedestrian ? '0px' : defaultGap;

    return (
        <Box
            sx={{
                ...sx,
                bgcolor: 'black',
                width: '50px',
                height: pedestrian ? '85px' : '130px',
                borderRadius: '10px',
                display: 'grid',
                gridTemplateColumns: `${defaultPadding} auto ${defaultPadding}`,
                gridTemplateRows: `${defaultPadding} auto ${padding} ${heightCenterElement} ${defaultGap} auto ${defaultPadding}`,
                gridTemplateAreas: `
                '. . .'
                '. el1 .'
                '. . .'
                '. el2 .'
                '. . .'
                '. el3 .'
                '. . .'
                `,
            }}
        >
            <TrafficLightElement color='red' active={red} sx={{gridArea: 'el1'}} />
            {!pedestrian && <TrafficLightElement color='yellow' active={yellow} sx={{gridArea: 'el2'}} />}
            <TrafficLightElement color='lime' active={green} sx={{gridArea: 'el3'}} />
        </Box>
    );
};
