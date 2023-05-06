import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';


export const useOrientation = () => {
    const [screenInfo, setScreenInfo] = useState(Dimensions.get('screen'));

    useEffect(() => {
        const onChange = (handler: any) => {
            setScreenInfo(handler.screen);
        }

        Dimensions.addEventListener('change', onChange);

        return () => (Dimensions as any).removeEventListener('change', onChange);
    }, [])

    return {
        ...screenInfo,
        isPortrait: screenInfo.height > screenInfo.width
    }

}