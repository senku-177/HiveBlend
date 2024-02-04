import { Navigate,useNavigate } from "react-router-dom";

function PrivateRoutes({connected,children}){


    if(connected){
        return children;
    }
    else{
        return <Navigate to="/home"/> 
    }

}
export default PrivateRoutes;