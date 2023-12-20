const key = process.env.NODE_ENV === "production" && typeof window !== "undefined" ? window.location.origin : "http://localhost:5000";
export default key;