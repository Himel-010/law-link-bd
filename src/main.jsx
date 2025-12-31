import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Layout from './Components/Layout/Layout';
import Home from './Components/Home/Home';
import SignIn from './Components/SingIn/SignIN';
import { Provider } from 'react-redux';  
import { PersistGate } from 'redux-persist/integration/react';  
import { store, persistor } from './Redux/Store/Store';  
import SignUp from './Components/SingUP/SignUP';
import LawyersPage from './Components/LawyersPage/LawyersPage';
import ContactPage from './Components/Contact/ContactPage';
import ResourcesPage from './Components/ResourcesPage/ResourcesPage';


// Define your routes
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,  
    children: [
      { path: '', element: <Home /> },
      { path: 'sign-in', element: < SignIn/> },
      { path: 'sign-up', element: < SignUp/> },
      { path: 'lawyers', element: < LawyersPage/> },
      { path: 'contact-us', element: < ContactPage/> },
      { path: 'resources', element: < ResourcesPage/> },
      
      
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
  </StrictMode>
);
