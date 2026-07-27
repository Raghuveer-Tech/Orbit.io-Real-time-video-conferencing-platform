import axios from "axios";
import httpStatus from "http-status";
import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import server from "../environment";


export const AuthContext = createContext({});
// http://localhost:8000/api/v1/users` videomeet and change localhost server.prod
const client = axios.create({
    baseURL: `${server.prod}/api/v1/users`
})

const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token") || ""}`
})

// Add response interceptor for handling token expiration
client.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("name");
            window.location.href = "/auth";
        }
        return Promise.reject(error);
    }
);

export const AuthProvider = ({ children }) => {

    const authContext = useContext(AuthContext);


    const [userData, setUserData] = useState(authContext);


    const router = useNavigate();

    const handleRegister = async (name, username, password) => {
        try {
            let request = await client.post("/register", {
                name: name,
                username: username,
                password: password
            })


            if (request.status === httpStatus.CREATED) {
                return request.data.message;
            }
        } catch (err) {
            throw err;
        }
    }

    const handleLogin = async (username, password) => {
        try {
            let request = await client.post("/login", {
                username: username,
                password: password
            });

            if (request.status === httpStatus.OK) {
                localStorage.setItem("token", request.data.token);
                localStorage.setItem("name", request.data.name || username);
                router("/home")
            }
        } catch (err) {
            throw err;
        }
    }

    const getHistoryOfUser = async () => {
        try {
            let request = await client.get("/get_all_activity", {
                headers: getAuthHeaders()
            });
            return request.data
        } catch
         (err) {
            throw err;
        }
    }

    const addToUserHistory = async (meetingCode) => {
        try {
            let request = await client.post("/add_to_activity", {
                meeting_code: meetingCode
            }, {
                headers: getAuthHeaders()
            });
            return request
        } catch (e) {
            throw e;
        }
    }

    const handleLogout = async () => {
        try {
            await client.post("/logout", {}, {
                headers: getAuthHeaders()
            });
        } catch (e) {
            console.error("Logout error:", e);
        } finally {
            localStorage.removeItem("token");
            localStorage.removeItem("name");
            router("/auth");
        }
    }

    const data = {
        userData, setUserData, addToUserHistory, getHistoryOfUser, handleRegister, handleLogin, handleLogout
    }

    return (
        <AuthContext.Provider value={data}>
            {children}
        </AuthContext.Provider>
    )

}
