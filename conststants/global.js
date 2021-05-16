import React, {useEffect, useState} from 'react';
import { Dimensions } from "react-native";

export const Bottom = {
    dark: false,
    colors: {
        primary: '#000',
        card: '#000',
        text: '#fff',
        border: 'none',
        notification: 'rgb(255, 69, 58)',
    },
};

export const Top = {
    dark: false,
    colors: {
        primary: '#000',
        card: '#000',
        border: 'none',
        text: '#fff',
        notification: 'rgb(255, 69, 58)',
    },
};

export const ButtonTheme = {
    dark: false,
    colors: {
        primary: '#000',
    },
};

export const useScreenDimensions = () => {
    const [screenData, setScreenData] = useState(Dimensions.get('screen'));

    useEffect(() => {
        const onChange = (result) => {
            setScreenData(result.screen);
        };

        Dimensions.addEventListener('change', onChange);

        return () => Dimensions.removeEventListener('change', onChange);
    });

    return {
        ...screenData,
        isLandscape: screenData.width > screenData.height,
    };
};


export const data = [1, 0, 1, 0, 1, 0, 1, 0, 1];
