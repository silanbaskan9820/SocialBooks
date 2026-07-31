import api from "../api/api";

export const getNotifications = async () => {
    const token = localStorage.getItem("token");

    const response = await api.get("/notifications", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
});

    return response.data;
}

export async function markNotificationAsRead(id) {
    const token = localStorage.getItem("token");

    const response = await api.put(
        `/notifications/${id}/read`,
    {},
{
    headers: {
        Authorization: `Bearer ${token}`,
    },
}
);

    return response.data;
}