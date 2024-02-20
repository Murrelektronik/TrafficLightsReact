import {useEffect, useRef, useState} from 'react';

export type ITrafficLightManager = {
    startMain: boolean;
    startSide: boolean;
    startPedestrian: boolean;
    setMainFinished: (value: boolean) => void;
    setSideFinished: (value: boolean) => void;
    setPedestrianFinished: (value: boolean) => void;
};

export type TrafficLightManagerProps = {
    start: boolean;
    pedestrianRequest: boolean;
};

export const useTrafficLightManager = (props: TrafficLightManagerProps): ITrafficLightManager => {
    const {start, pedestrianRequest} = props;

    const [startMain, setStartMain] = useState<boolean>(false);
    const [startSide, setStartSide] = useState<boolean>(false);
    const [startPedestrian, setStartPedestrian] = useState<boolean>(false);
    const [pedRequest, setPedRequest] = useState<boolean>(false);

    const [mainFinished, setMainFinished] = useState<boolean>(false);
    const [sideFinished, setSideFinished] = useState<boolean>(false);
    const [pedestrianFinished, setPedestrianFinished] = useState<boolean>(false);

    enum LastStreet {
        Main,
        Side,
    }
    const lastStreet = useRef<LastStreet>(LastStreet.Main);

    useEffect(() => {
        if (start === true) {
            setStartMain(true);
        }
    }, [start]);

    useEffect(() => {
        if (mainFinished === true) {
            lastStreet.current = LastStreet.Main;
            setMainFinished(false);
            setStartMain(false);
            if (pedRequest) {
                setStartPedestrian(true);
                return;
            }
            setStartSide(true);
        }
    }, [mainFinished]);

    useEffect(() => {
        if (sideFinished === true) {
            lastStreet.current = LastStreet.Side;
            setSideFinished(false);
            setStartSide(false);
            if (pedRequest) {
                setStartPedestrian(true);
                return;
            }
            setStartMain(true);
        }
    }, [sideFinished]);

    useEffect(() => {
        if (pedestrianRequest === true) {
            setPedRequest(true);
        }
    }, [pedestrianRequest]);

    useEffect(() => {
        if (pedestrianFinished === true) {
            setPedRequest(false);
            setPedestrianFinished(false);
            setStartPedestrian(false);
            if (lastStreet.current === LastStreet.Side) {
                setStartMain(true);
            } else {
                setStartSide(true);
            }
        }
    }, [pedestrianFinished]);
    return {
        startMain,
        startSide,
        startPedestrian,
        setMainFinished,
        setSideFinished,
        setPedestrianFinished,
    };
};
