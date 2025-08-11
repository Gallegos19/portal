import {createBrowserRouter} from 'react-router-dom';
import Home from '../../features/Home/presentation/pages/Home';

export const navigationWrapper = createBrowserRouter([
    {
        path: '/',
        element: <Home />,  

    },

]);