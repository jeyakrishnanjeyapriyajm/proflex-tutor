import API from "./api";

export const getAdminOverview = async () => {
  const { data } = await API.get("/admin/overview");
  return data;
};

export const getAdminUsers = async (params = {}) => {
  const { data } = await API.get("/admin/users", { params });
  return data;
};

export const getPendingInstructors = async () => {
  const { data } = await API.get("/admin/pending-instructors");
  return data;
};

export const approveInstructorApi = async (userId) => {
  const { data } = await API.put(`/admin/approve-instructor/${userId}`);
  return data;
};

export const rejectInstructorApi = async (userId, reason = "Rejected by admin") => {
  const { data } = await API.put(`/admin/reject-instructor/${userId}`, {
    reason,
  });
  return data;
};

export const activateUserApi = async (userId) => {
  const { data } = await API.patch(`/admin/users/${userId}/activate`);
  return data;
};

export const deactivateUserApi = async (userId) => {
  const { data } = await API.patch(`/admin/users/${userId}/deactivate`);
  return data;
};

export const changeUserRoleApi = async (userId, role) => {
  const { data } = await API.patch(`/admin/users/${userId}/change-role`, {
    role,
  });
  return data;
};
// Admin curriculum module APIs
export const getAdminCurriculumModules = async () => {
  const { data } = await API.get("/admin/curriculum/modules");
  return data;
};

export const createAdminCurriculumModule = async (payload) => {
  const { data } = await API.post("/admin/curriculum/modules", payload);
  return data;
};

export const updateAdminCurriculumModule = async (moduleId, payload) => {
  const { data } = await API.patch(
    `/admin/curriculum/modules/${moduleId}`,
    payload
  );
  return data;
};

export const deleteAdminCurriculumModule = async (moduleId) => {
  const { data } = await API.delete(`/admin/curriculum/modules/${moduleId}`);
  return data;
};

export const toggleAdminCurriculumModuleStatus = async (moduleId) => {
  const { data } = await API.patch(
    `/admin/curriculum/modules/${moduleId}/toggle-status`
  );
  return data;
};

// Admin lesson APIs
export const getAdminModuleLessons = async (moduleId) => {
  const { data } = await API.get(
    `/admin/curriculum/modules/${moduleId}/lessons`
  );
  return data;
};

export const createAdminModuleLesson = async (moduleId, payload) => {
  const { data } = await API.post(
    `/admin/curriculum/modules/${moduleId}/lessons`,
    payload
  );
  return data;
};

export const updateAdminLesson = async (lessonId, payload) => {
  const { data } = await API.patch(
    `/admin/curriculum/lessons/${lessonId}`,
    payload
  );
  return data;
};

export const deleteAdminLesson = async (lessonId) => {
  const { data } = await API.delete(`/admin/curriculum/lessons/${lessonId}`);
  return data;
};