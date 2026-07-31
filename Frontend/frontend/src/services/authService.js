import api from "../api/api";

export const login = async (formData) => {
    const response = await api.post("/users/login", formData);

    return response.data;
};

export const register = async (formData) => {
    const response = await api.post("/users/register", formData);

    return response.data;
};

export const getUserProfile = async (id) => {

    const response = await api.get(`/users/${id}`);

    return response.data;

};

export const followUser = async (id) => {
    const response = await api.post(`/users/${id}/follow`);
    
    return response.data;
};

export const updateUser = async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);

    return response.data;
}

export const uploadProfilePhoto = async (id, file) => {
    const formData = new FormData();

    formData.append("profileImage", file);

    const response = await api.put(
        `/users/${id}/photo`, 
        formData, 
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
    return response.data;
}

export const changePassword = async (data) => {
    const response = await api.put("/users/change-password", data);

    return response.data;
};

export const updateNotificationSettings = async (userId, settings) => {
    const response = await api.put(`/users/${userId}/notifications`, settings);

    return response.data;
}

export const deleteAccount = async (userId, password) => {
    const response = await api.delete(`/users/${userId}`, { data: {password}});

        return response.data;
}

export const changeEmail = async (data) => {
    const response = await api.put("/users/change-email", data);
     
    return response.data;
}

export const updatePrivacySettings = async (userId, settings) => {
    const response = await api.put(`/users/${userId}/privacy`, settings);

    return response.data;
}

export const updateLanguage = async (userId, language) => {

    const response = await api.put(
        `/users/${userId}/language`, 
        { language }
    );

    return response.data;
}