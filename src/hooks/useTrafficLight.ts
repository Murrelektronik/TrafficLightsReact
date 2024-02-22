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
        /** @xstate-layout N4IgpgJg5mDOIC5QBUBOBDAZpglgYwAIAZHKACwBcA6ASQDscKBiWC9VCgbQAYBdRUAAcA9rEY5hdASAAeiAIwBOAExVuANmUBWADQgAnogDMWgCxUtADiM3bdowF8HetFlyES5agCVITVJAAIpJgPPxIICJiFBJSEXIIpkbqFkby2nqGCMrKKdzW9vZOLhjY+MSklFS+EP5BIQAKkHAUqDjodGHSUeKS0glJKVppGQbG6pZUBYV2xSCuZR6VPpAAmmAANhvCAO51EOtbu8F0oXzdor1xoAmWuVTy3IpGAOy6Y9n3+TOzzvOl7gqXioAHEAmA6EwoOC6CczuEhJcYn14gp5OpuA9TBpRlkcloqMpTIoSaSyYoXnMFoDPFUwWAIVCYXCmhAWm0Ol0Ij1kddZGiMVice8sskXlRyZKSaYqQDyrTqIdtnt9JtlXCuYjorF+gozCk3plEPjCcSpaTKX9qfLllQAGI4OjoDZMXBOjYa87cpE61EIeRaTRqEYixCWeRUM3mkmWv50YRs+ARa1LLwXbUom6IAC0Eym3Hyyhe4cU6ImRiNCFzagL3GG8lMlm4RksgbesrcNuB9EY6auuqrykxTcLxaUZbuL0rRhyanU8hniismiHMqtctTVRqfd5A+UlkUVBe8ksho+NgjVh+tg7iyBW7Wat2O99WYQ6iMh8sSTPeObammH5bxpW16QhF9M35BASUmZRFAmX9jCMTEXijc01xKTtN0VJ8dggvkEgXcNI2FSsh1UIloxjYCuyqB13Xwgd5GLcxNGQ7gXgmDQNDI-9vmvZRHCcBwgA */
        id: 'Traffic Light',
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
