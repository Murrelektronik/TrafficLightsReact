import {useEffect, useState} from 'react';
import {setup, createActor} from 'xstate';

export type ITrafficLight = {
    red: boolean;
    yellow: boolean;
    green: boolean;
    done: boolean;
    setRun: (value: boolean) => void;
};

export type TrafficLightConfig = {
    timeRed: number;
    timeRedYellow: number;
    timeGreen: number;
    timeYellow: number;
    pedestrian: boolean;
};

export const useTrafficLight = (config?: Partial<TrafficLightConfig>): ITrafficLight => {
    const [red, setRed] = useState<boolean>(true);
    const [yellow, setYellow] = useState<boolean>(false);
    const [green, setGreen] = useState<boolean>(false);
    const [done, setDone] = useState<boolean>(false);

    const [start, setStart] = useState<boolean>(false);

    const trafficLightMachine = setup({
        actions: {
            init: () => {
                console.log('init action');
                setRed(true);
                setYellow(false);
                setGreen(false);
                actor.send({type: 'initDone'});
            },
            red: () => {
                console.log('red action');
                setRed(true);
                setYellow(false);
                setGreen(false);
                setTimeout(() => {
                    console.log('red time done');
                    if (config?.pedestrian) {
                        actor.send({type: 'redDonePedestrian'});
                        return;
                    }
                    actor.send({type: 'redDone'});
                }, config?.timeRed || 2000);
            },
            redYellow: () => {
                console.log('red yellow action');
                setRed(true);
                setYellow(true);
                setGreen(false);
                setTimeout(() => {
                    actor.send({type: 'redYellowDone'});
                }, config?.timeRedYellow || 1000);
            },
            green: () => {
                console.log('red yellow action');
                setRed(false);
                setYellow(false);
                setGreen(true);
                setTimeout(() => {
                    if (config?.pedestrian) {
                        actor.send({type: 'greenDonePedestrian'});
                        return;
                    }
                    actor.send({type: 'greenDone'});
                }, config?.timeGreen || 5000);
            },
            yellow: () => {
                console.log('yellow action');
                setRed(false);
                setYellow(true);
                setGreen(false);
                setTimeout(() => {
                    actor.send({type: 'yellowDone'});
                }, config?.timeYellow || 1000);
            },
            final: () => {
                console.log('final action');
                setRed(true);
                setYellow(false);
                setGreen(false);
                setStart(false);
                setDone(true);
                actor.send({type: 'finalDone'});
            },
        },
    }).createMachine({
        /** @xstate-layout N4IgpgJg5mDOIC5QBcD2UoBswDoCSAdgJbIDEsyAhgE7IDaADALqKgAOqsJRqBrIAD0QBGAGzCcwgKyipAJmGK5CqQGZRAGhABPROoAcOfapOmzJgL4WtaDNhwAlSKWqQAIrzCMWSEBy7IPHy+QggALKJyOADsqmGq0VJaugjKojgMxubmVjboWLhOEC7ungAKkHDI1ESUBN78-ty8-KERUbHxicl6ooZZ2Wa5ILYFjpAAmmCYmKgA7iUQUzPzHgRezI2czcGgofryOKrCckk6iGkZA4Oqw6P2AOKuYASkUM8Eaxs+7NuBLSERMJ9Ok4gkzillFIcHIwgBOBGIpFw6J3fKPD5vD5fCoQKo1OoNXxNf67QRAkFHLoQ3rRHDIhkIsJouy4ZazBbaaYcr5E34BIKtERSaJROFqE401KnGHwxmI1HWEbo3AAMSIBEomFIADMNVreZtiX9BYCENJ9IY5GDuucEPoJHL5QjFUqCKg8fBfPcwFsBQC9ogALQnBgxMRSMKZRTw4E9BBB6FI0Tw05SFHi-QssaEEh+nZChOi8OyKMO4Sx-TxuLQsxhUXRFH6OTZ+xFfOkwvHJMKfS2lImCRSa6DVuFSbc+Yd02BhCiecZCJ9qVyBiqK43UxjnBPMAvacB8nmhiwnBSkxh6JO+XMpU+nDsqfG-1k0IVhh00QMOHg+OrqKws6LrbuqmqYAer4iNE+iXsIDDCKocJhOmqiRtEf4IWeJ7xAh9bGMuVhWEAA */
        id: 'toggle',
        initial: 'Init',
        states: {
            Init: {
                entry: ['init'],
                on: {
                    start: {
                        target: 'Red',
                    },
                },
            },
            Red: {
                entry: ['red'],
                on: {
                    redDone: {
                        target: 'RedYellow',
                    },
                    redDonePedestrian: {
                        target: 'Green',
                    },
                },
            },
            RedYellow: {
                entry: ['redYellow'],
                on: {
                    redYellowDone: {
                        target: 'Green',
                    },
                },
            },
            Green: {
                entry: ['green'],
                on: {
                    greenDone: {
                        target: 'Yellow',
                    },
                    greenDonePedestrian: {
                        target: 'Final',
                    },
                },
            },
            Yellow: {
                entry: ['yellow'],
                on: {
                    yellowDone: {
                        target: 'Final',
                    },
                },
            },
            Final: {
                entry: ['final'],
                on: {
                    finalDone: 'Init',
                },
            },
        },
    });
    const actor = createActor(trafficLightMachine);
    actor.subscribe(snapshot => {
        console.log('Value:', snapshot.value);
    });

    useEffect(() => {
        if (start) {
            console.log('Start', config);
            actor.start();
            actor.send({type: 'start'});
        }
        if (!start && done) {
            setDone(false);
            actor.send({type: 'finishDone'});
            console.log('finished', start);
        }
    }, [start]);

    return {
        red,
        yellow,
        green,
        done,
        setRun: setStart,
    };
};
