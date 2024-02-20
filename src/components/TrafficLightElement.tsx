import {Box, SxProps} from '@mui/material';

export type ITrafficLightElement = {
    color: string;
    active: boolean;
    sx?: SxProps;
};

export const TrafficLightElement = (props: ITrafficLightElement): JSX.Element => {
    const {color, active, sx} = props;
    return (
        <Box
            sx={{
                ...sx,
                bgcolor: active ? color : '#555555',
                borderRadius: '50%',
            }}
        ></Box>
    );
};
