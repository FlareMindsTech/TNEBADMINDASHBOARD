// axiosInstance.js - Production-Ready Centralized API Client & Error Handler
import axios from "axios";
import {
  AppError,
  parseApiError,
  showErrorToast,
  sanitizeErrorMessage,
  logApiError,
} from "./errorHandler";

// Re-export error utilities for convenient import across views
export { AppError, parseApiError, showErrorToast, sanitizeErrorMessage, logApiError };

// --- Configuration ---
const API_BASE_URL = "https://tnebserver-u7qr.onrender.com";
const BASE_URL = "https://tnebserver-u7qr.onrender.com/api";
const TIMEOUT_MS = 15000;

export const getAuthHeaders = (isFormData = false) => {
  const token = localStorage.getItem("token");
  const headers = {};
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

// =========================================================
// 1. GENERAL USER & ADMIN AXIOS INSTANCES
// =========================================================
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: TIMEOUT_MS,
  headers: { "Content-Type": "application/json" },
});

const adminAxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: TIMEOUT_MS,
  headers: { "Content-Type": "application/json" },
});

// Interceptor for Axios instances (attaches tokens & handles 401)
const authRequestInterceptor = (config) => {
  const token = localStorage.getItem("token");
  if (token && !config.headers["Authorization"]) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
};

const commonResponseInterceptor = (response) => response;

const commonErrorInterceptor = (error) => {
  const parsed = parseApiError(error);
  if (parsed.isAuthError) {
    console.warn("⚠️ Unauthorized session. Clearing token.");
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } catch (e) {}
  }
  logApiError(error.config?.url || "Axios Request", parsed);
  return Promise.reject(parsed);
};

axiosInstance.interceptors.request.use(authRequestInterceptor);
axiosInstance.interceptors.response.use(commonResponseInterceptor, commonErrorInterceptor);

adminAxiosInstance.interceptors.request.use(authRequestInterceptor);
adminAxiosInstance.interceptors.response.use(commonResponseInterceptor, commonErrorInterceptor);

export default axiosInstance;
export { adminAxiosInstance, BASE_URL, API_BASE_URL };

// =========================================================
// 2. CENTRALIZED API REQUEST HELPER (FETCH-BASED)
// =========================================================
/**
 * Core centralized request runner that handles timeouts, headers, JSON/FormData,
 * response parsing, and unified error mapping through AppError.
 */
export const apiRequest = async (endpoint, options = {}) => {
  const {
    method = "GET",
    body = null,
    isFormData = false,
    headers: customHeaders = {},
    timeout = TIMEOUT_MS,
    baseUrl = BASE_URL,
  } = options;

  const url = endpoint.startsWith("http://") || endpoint.startsWith("https://")
    ? endpoint
    : `${baseUrl}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const authHeaders = getAuthHeaders(isFormData || body instanceof FormData);
    const finalHeaders = {
      ...authHeaders,
      ...customHeaders,
    };

    const fetchConfig = {
      method,
      headers: finalHeaders,
      signal: controller.signal,
    };

    if (body !== null && body !== undefined) {
      if (body instanceof FormData || isFormData) {
        fetchConfig.body = body;
      } else if (typeof body === "object") {
        fetchConfig.body = JSON.stringify(body);
      } else {
        fetchConfig.body = body;
      }
    }

    const response = await fetch(url, fetchConfig);

    clearTimeout(timeoutId);

    // Parse JSON response body if available
    let responseData = null;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      responseData = await response.json().catch(() => null);
    } else {
      const text = await response.text().catch(() => "");
      try {
        responseData = text ? JSON.parse(text) : null;
      } catch (e) {
        responseData = text;
      }
    }

    if (!response.ok) {
      const rawMessage =
        responseData?.message ||
        responseData?.error ||
        responseData?.msg ||
        (typeof responseData === "string" ? responseData : null);

      const appError = parseApiError({
        status: response.status,
        message: rawMessage,
        response: {
          status: response.status,
          data: typeof responseData === "object" ? responseData : { message: responseData },
        },
      });

      logApiError(`${method} ${endpoint}`, appError);
      throw appError;
    }

    return responseData;
  } catch (error) {
    clearTimeout(timeoutId);
    const parsedError = parseApiError(error);
    logApiError(`${method} ${endpoint}`, parsedError);
    throw parsedError;
  }
};

// =========================================================
// 3. CENTRALIZED API FUNCTIONS
// =========================================================

// ----- Events APIs -----
export const getAllEvents = async () => {
  return apiRequest("/events", { method: "GET" });
};

export const createEvent = async (eventData) => {
  return apiRequest("/events", {
    method: "POST",
    body: eventData, // Expecting FormData for file upload
    isFormData: true,
  });
};

export const updateEvent = async (eventId, eventData) => {
  return apiRequest(`/events/${eventId}`, {
    method: "PUT",
    body: eventData, // Expecting FormData
    isFormData: true,
  });
};

export const deleteEvent = async (eventId) => {
  return apiRequest(`/events/${eventId}`, {
    method: "DELETE",
  });
};

// ----- Carousel APIs -----
export const getCarousel = async () => {
  return apiRequest("/carousel", { method: "GET" });
};

export const createCarouselImage = async (carouselData) => {
  return apiRequest("/carousel", {
    method: "POST",
    body: carouselData, // FormData
    isFormData: true,
  });
};

export const updateCarousel = async (id, carouselData) => {
  return apiRequest(`/carousel/${id}`, {
    method: "PUT",
    body: carouselData, // FormData
    isFormData: true,
  });
};

export const deleteCarousel = async (id) => {
  return apiRequest(`/carousel/${id}`, {
    method: "DELETE",
  });
};

// ----- E-Minthiran APIs -----
export const getAllMinthiran = async () => {
  return apiRequest("/minthiran", { method: "GET" });
};

export const createMinthiran = async (formData) => {
  return apiRequest("/minthiran", {
    method: "POST",
    body: formData,
    isFormData: true,
  });
};

export const updateMinthiran = async (id, formData) => {
  return apiRequest(`/minthiran/${id}`, {
    method: "PUT",
    body: formData,
    isFormData: true,
  });
};

export const deleteMinthiran = async (id) => {
  return apiRequest(`/minthiran/${id}`, {
    method: "DELETE",
  });
};

// ----- Gallery APIs -----
export const getAllGalleries = async () => {
  return apiRequest("/gallery", { method: "GET" });
};

export const createGallery = async (formData) => {
  return apiRequest("/gallery", {
    method: "POST",
    body: formData,
    isFormData: true,
  });
};

export const updateGallery = async (id, formData) => {
  return apiRequest(`/gallery/${id}`, {
    method: "PUT",
    body: formData,
    isFormData: true,
  });
};

export const deleteGallery = async (id) => {
  return apiRequest(`/gallery/${id}`, {
    method: "DELETE",
  });
};

export const getGalleryById = async (id) => {
  return apiRequest(`/gallery/${id}`, { method: "GET" });
};

export const deleteGalleryImage = async (galleryId, imageId) => {
  return apiRequest(`/gallery/${galleryId}/image/${imageId}`, {
    method: "DELETE",
  });
};

// ----- Admin APIs -----
export const getAllAdmins = async () => {
  return apiRequest("/admins/all", { method: "GET" });
};

export const createAdmin = async (adminData) => {
  return apiRequest("/admins/create", {
    method: "POST",
    body: adminData,
  });
};

export const updateAdmin = async (adminId, updatedData) => {
  return apiRequest(`/admins/update/${adminId}`, {
    method: "PUT",
    body: updatedData,
  });
};

export const inActiveAdmin = async (adminId) => {
  return apiRequest(`/admins/delete/${adminId}`, {
    method: "DELETE",
  });
};

// ----- Category APIs -----
export const getAllCategories = async () => {
  return apiRequest("/categories/all", { method: "GET" });
};

export const createCategories = async (categoryData) => {
  return apiRequest("/categories/create", {
    method: "POST",
    body: categoryData,
  });
};

export const updateCategories = async (categoryId, updatedData) => {
  return apiRequest(`/categories/update/${categoryId}`, {
    method: "PUT",
    body: updatedData,
  });
};

export const deleteCategory = async (categoryId) => {
  return apiRequest(`/categories/delete/${categoryId}`, {
    method: "DELETE",
  });
};

// ----- Product APIs -----
export const getAllProducts = async () => {
  return apiRequest("/products/all", { method: "GET" });
};

export const createProducts = async (productData) => {
  return apiRequest("/products/create", {
    method: "POST",
    body: productData,
  });
};

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const data = await apiRequest("/products/upload", {
    method: "POST",
    body: formData,
    isFormData: true,
  });
  return data?.url || data;
};

export const updateProducts = async (productId, updatedData) => {
  return apiRequest(`/products/update/${productId}`, {
    method: "PUT",
    body: updatedData,
  });
};

export const deleteProducts = async (productId) => {
  return apiRequest(`/products/delete/${productId}`, {
    method: "DELETE",
  });
};

export const uploadProductImage = async (productId, file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("productId", productId);
  return apiRequest("/products/upload", {
    method: "POST",
    body: formData,
    isFormData: true,
  });
};

export const deleteProductImage = async (productId, public_id) => {
  return apiRequest("/products/delete-image", {
    method: "POST",
    body: { productId, public_id },
  });
};

// ----- User APIs -----
export const getAllUsers = async () => {
  return apiRequest("/users/all", { method: "GET" });
};

export const createUser = async (userData) => {
  return apiRequest("/users/register", {
    method: "POST",
    body: userData,
  });
};

export const updateUser = async (userId, updatedData) => {
  return apiRequest(`/users/update/${userId}`, {
    method: "PUT",
    body: updatedData,
  });
};

export const deleteUser = async (userId) => {
  return apiRequest(`/users/delete/${userId}`, {
    method: "DELETE",
  });
};

// ----- Orders APIs -----
export const getAllOrders = async () => {
  return apiRequest("/orders/all", { method: "GET" });
};

export const createOrders = async (orderData) => {
  return apiRequest("/Orders/create", {
    method: "POST",
    body: orderData,
  });
};

export const updateOrders = async (orderId, updatedData) => {
  return apiRequest(`/orders/update/${orderId}`, {
    method: "PUT",
    body: updatedData,
  });
};

// ----- Offers APIs -----
export const getAllOffers = async () => {
  return apiRequest("/offers/all", { method: "GET" });
};

export const createOffer = async (offerData) => {
  return apiRequest("/offers/create", {
    method: "POST",
    body: offerData,
  });
};

export const updateOffer = async (offerId, offerData) => {
  return apiRequest(`/offers/update/${offerId}`, {
    method: "PUT",
    body: offerData,
  });
};

export const deleteOffer = async (offerId) => {
  return apiRequest(`/offers/delete/${offerId}`, {
    method: "DELETE",
  });
};

// ----- Forms APIs -----
export const getAllForms = async (type = "") => {
  const endpoint = type ? `/forms?type=${encodeURIComponent(type)}` : "/forms";
  return apiRequest(endpoint, { method: "GET" });
};

export const createForm = async (formData) => {
  return apiRequest("/forms", {
    method: "POST",
    body: formData,
    isFormData: true,
  });
};

export const updateForm = async (formId, formData) => {
  return apiRequest(`/forms/${formId}`, {
    method: "PUT",
    body: formData,
    isFormData: true,
  });
};

export const deleteForm = async (formId) => {
  return apiRequest(`/forms/${formId}`, {
    method: "DELETE",
  });
};

// ----- Important Notice APIs -----
export const getAllNotices = async (type = "") => {
  const endpoint = type ? `/important-notices?Type=${encodeURIComponent(type)}` : "/important-notices";
  return apiRequest(endpoint, { method: "GET" });
};

export const createNotice = async (noticeData) => {
  return apiRequest("/important-notices", {
    method: "POST",
    body: noticeData,
    isFormData: true,
  });
};

export const updateNotice = async (noticeId, noticeData) => {
  return apiRequest(`/important-notices/${noticeId}`, {
    method: "PUT",
    body: noticeData,
    isFormData: true,
  });
};

export const deleteNotice = async (noticeId) => {
  return apiRequest(`/important-notices/${noticeId}`, {
    method: "DELETE",
  });
};

// ----- Committee APIs (Admin) -----
export const getCommitteeMembers = async (type = "CEC") => {
  return apiRequest(`/admin/committees/${type}/members`, { method: "GET" });
};

export const createCommitteeMember = async (type = "CEC", memberData) => {
  return apiRequest(`/admin/committees/${type}/members`, {
    method: "POST",
    body: memberData,
    isFormData: true,
  });
};

export const updateCommitteeMember = async (type = "CEC", memberId, memberData) => {
  return apiRequest(`/admin/committees/${type}/members/${memberId}`, {
    method: "PUT",
    body: memberData,
    isFormData: true,
  });
};

export const deleteCommitteeMember = async (type = "CEC", memberId) => {
  return apiRequest(`/admin/committees/${type}/members/${memberId}`, {
    method: "DELETE",
  });
};

export const getCommitteeTerm = async (type = "CEC") => {
  return apiRequest(`/admin/committees/${type}/term`, { method: "GET" });
};

export const updateCommitteeTerm = async (type = "CEC", termData) => {
  return apiRequest(`/admin/committees/${type}/term`, {
    method: "PUT",
    body: termData,
  });
};

export const getCommitteeResponsibilities = async (type = "CEC") => {
  return apiRequest(`/admin/committees/${type}/responsibilities`, { method: "GET" });
};

export const createCommitteeResponsibility = async (type = "CEC", respData) => {
  return apiRequest(`/admin/committees/${type}/responsibilities`, {
    method: "POST",
    body: respData,
  });
};

export const updateCommitteeResponsibility = async (type = "CEC", respId, respData) => {
  return apiRequest(`/admin/committees/${type}/responsibilities/${respId}`, {
    method: "PUT",
    body: respData,
  });
};

export const deleteCommitteeResponsibility = async (type = "CEC", respId) => {
  return apiRequest(`/admin/committees/${type}/responsibilities/${respId}`, {
    method: "DELETE",
  });
};
