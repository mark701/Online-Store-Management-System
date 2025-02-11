import { Navigate, createBrowserRouter } from "react-router-dom";
import Home  from "./pages/Home/Home";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import App from "./App";
import Auction from "./pages/Product/Auction";
import Create from "./pages/Product/Create";
import History from "./pages/Product/History";
import Profile from "./pages/UserProfile/Profile";
import Manageusers from "./ManageUsers/Manageusers";
import SearchResults from "./pages/SearchResults";

export const routes= createBrowserRouter([
    {
        path:"",
        element: <App/>,
        children:[
            {
                path:"/",
                element:<Home/>
            },
            {
                path:"/register",
                element:<Register/>
            },
            {
                path:"/auction",
                element:<Auction/>
            },
            {
                path:"/create",
                element:<Create/>
            },
            {
                path:"/history",
                element:<History/>
            },
            {
                path:"/Settings",
                element:<Profile/>
                
            },           
            {
                path:"/ManageUsers",
                element:<Manageusers/>
                
            },
            {
                path:"/Search",
                element:<SearchResults/>
                
            },


        ]

        
        
    },
    {
        path:"*",
        element: <Navigate to={"/"}/>
    },
   

]) 