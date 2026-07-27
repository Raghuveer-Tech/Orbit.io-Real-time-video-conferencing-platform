const server = {
    dev: process.env.REACT_APP_API_URL || "http://localhost:8000",
    prod: process.env.REACT_APP_API_URL || "http://localhost:8000"
};

export default server;