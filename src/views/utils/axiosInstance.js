
//axiosInstance.js
import axios from "axios";

// --- Configuration ---
const API_BASE_URL = "https://tnebserver-u7qr.onrender.com";
const BASE_URL = "https://tnebserver-u7qr.onrender.com/api";
const TIMEOUT_MS = 10000;

const getAuthHeaders = (isFormData = false) => {
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
// 1. GENERAL USER AXIOS INSTANCE
// =========================================================
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: TIMEOUT_MS,
  headers: { "Content-Type": "application/json" },
});

// =========================================================
// 2️⃣ ADMIN / SUPER ADMIN AXIOS INSTANCE
// =========================================================
const adminAxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: TIMEOUT_MS,
  headers: { "Content-Type": "application/json" },
});

// =========================================================
// 3️⃣ COMMON RESPONSE INTERCEPTOR (401 Unauthorized handler)
// =========================================================
const unauthorizedResponseHandler = (error) => {
  if (error.response && error.response.status === 401) {
    console.warn("⚠️ Unauthorized (401).");
  }
  return Promise.reject(error);
};

axiosInstance.interceptors.response.use(
  (res) => res,
  unauthorizedResponseHandler
);

adminAxiosInstance.interceptors.response.use(
  (response) => response,
  unauthorizedResponseHandler
);

// =========================================================
// 4. EXPORTS
// =========================================================
export default axiosInstance;
export { adminAxiosInstance, BASE_URL };

// =========================================================
// 6. API CALL FUNCTIONS
// =========================================================

// ----- Events APIs -----
export const getAllEvents = async () => {
  try {
    const response = await fetch(`${BASE_URL}/events`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

export const createEvent = async (eventData) => {
  try {
    const response = await fetch(`${BASE_URL}/events`, {
      method: "POST",
      headers: getAuthHeaders(true),
      body: eventData, // Expecting FormData for file upload
    });
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
};

export const updateEvent = async (eventId, eventData) => {
  try {
    const response = await fetch(`${BASE_URL}/events/${eventId}`, {
      method: "PUT",
      headers: getAuthHeaders(true),
      body: eventData, // Expecting FormData
    });
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error updating event:", error);
    throw error;
  }
};

export const deleteEvent = async (eventId) => {
  try {
    const response = await fetch(`${BASE_URL}/events/${eventId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error deleting event:", error);
    throw error;
  }
};

// ----- Carousel APIs -----
export const getCarousel = async () => {
  try {
    const response = await fetch(`${BASE_URL}/carousel`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching carousel:", error);
    throw error;
  }
};

export const createCarouselImage = async (carouselData) => {
  try {
    const response = await fetch(`${BASE_URL}/carousel`, {
      method: "POST",
      headers: getAuthHeaders(true),
      body: carouselData, // Expecting FormData
    });
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error creating carousel image:", error);
    throw error;
  }
};

export const updateCarousel = async (id, carouselData) => {
  try {
    const response = await fetch(`${BASE_URL}/carousel/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(true),
      body: carouselData, // Expecting FormData
    });
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error updating carousel:", error);
    throw error;
  }
};

export const deleteCarousel = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/carousel/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error deleting carousel:", error);
    throw error;
  }
};

// ----- E-Minthiran APIs -----
export const getAllMinthiran = async () => {
  try {
    const response = await fetch(`${BASE_URL}/minthiran`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching magazines:", error);
    throw error;
  }
};

export const createMinthiran = async (formData) => {
  try {
    const response = await fetch(`${BASE_URL}/minthiran`, {
      method: "POST",
      headers: getAuthHeaders(true),
      body: formData, // Expecting FormData
    });
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error creating magazine:", error);
    throw error;
  }
};

export const updateMinthiran = async (id, formData) => {
  try {
    const response = await fetch(`${BASE_URL}/minthiran/${id}`, {
      method: "PUT",
      body: formData,
      headers: getAuthHeaders(true), // Expecting FormData
    });
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error updating magazine:", error);
    throw error;
  }
};

export const deleteMinthiran = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/minthiran/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(true),
    });
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error deleting magazine:", error);
    throw error;
  }
};

// ----- Gallery APIs -----
export const getAllGalleries = async () => {
  try {
    const response = await fetch(`${BASE_URL}/gallery`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching galleries:", error);
    throw error;
  }
};

export const createGallery = async (formData) => {
  try {
    const response = await fetch(`${BASE_URL}/gallery`, {
      method: "POST",
      headers: getAuthHeaders(true),
      body: formData, // Expecting FormData
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error creating gallery:", error);
    throw error;
  }
};

export const updateGallery = async (id, formData) => {
  try {
    const response = await fetch(`${BASE_URL}/gallery/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(true),
      body: formData, // Expecting FormData
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error updating gallery:", error);
    throw error;
  }
};

export const deleteGallery = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/gallery/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error deleting gallery:", error);
    throw error;
  }
};

export const getGalleryById = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/gallery/${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching gallery by ID:", error);
    throw error;
  }
};

export const deleteGalleryImage = async (galleryId, imageId) => {
  const url = `${BASE_URL}/gallery/${galleryId}/image/${imageId}`;
  try {
    console.log("Calling delete URL:", url);
    const response = await fetch(url, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error deleting gallery image:", error);
    throw error;
  }
};

// ----- Admin APIs -----
export const getAllAdmins = async () => {
  try {
    const response = await fetch(`${BASE_URL}/admins/all`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching admins:", error);
    throw error;
  }
};

export const createAdmin = async (adminData) => {
  try {
    const response = await fetch(`${BASE_URL}/admins/create`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(adminData),
    });
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error creating admin:", error);
    throw error;
  }
};

export const updateAdmin = async (adminId, updatedData) => {
  try {
    const response = await fetch(`${BASE_URL}/admins/update/${adminId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(updatedData),
    });
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error updating admin:", error);
    throw error;
  }
};

export const inActiveAdmin = async (adminId) => {
  try {
    const response = await fetch(`${BASE_URL}/admins/delete/${adminId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error deleting admin:", error);
    throw error;
  }
};


// ----- Category APIs -----
export const getAllCategories = async () => {
  try {
    const response = await fetch(`${BASE_URL}/categories/all`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const createCategories = async (categoryData) => {
  try {
    const response = await fetch(`${BASE_URL}/categories/create`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(categoryData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};

export const updateCategories = async (categoryId, updatedData) => {
  try {
    const response = await fetch(`${BASE_URL}/categories/update/${categoryId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(updatedData),
    });
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};


export const deleteCategory = async (categoryId) => {
  try {
    const response = await fetch(`${BASE_URL}/categories/delete/${categoryId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error deleting category:", error);
    throw error;
  }
};


// ----- Product APIs -----
export const getAllProducts = async () => {
  try {
    const response = await fetch(`${BASE_URL}/products/all`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const createProducts = async (productData) => {
  try {
    const response = await fetch(`${BASE_URL}/products/create`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(productData),
    });
    if (!response.ok) {
      let errorMessage = `Error: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
        const text = await response.text();
        errorMessage = text || errorMessage;
      }
      throw new Error(errorMessage);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

export const uploadImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${BASE_URL}/products/upload`, {
      method: "POST",
      headers: getAuthHeaders(true),
      body: formData,
    });
    if (!res.ok) {
      const text = await res.text();
      console.error("Error uploading image, backend response:", text);
      throw new Error("Image upload failed");
    }
    const data = await res.json();
    return data.url;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

export const updateProducts = async (productId, updatedData) => {
  try {
    const response = await fetch(`${BASE_URL}/products/update/${productId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(updatedData),
    });
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

export const deleteProducts = async (productId) => {
  try {
    const response = await fetch(`${BASE_URL}/products/delete/${productId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

// ----- User APIs -----
export const getAllUsers = async () => {
  try {
    const response = await fetch(`${BASE_URL}/users/all`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const createUser = async (userData) => {
  try {
    const response = await fetch(`${BASE_URL}/users/register`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const updateUser = async (userId, updatedData) => {
  try {
    const response = await fetch(`${BASE_URL}/users/update/${userId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(updatedData),
    });
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await fetch(`${BASE_URL}/users/delete/${userId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};


export const getAllOrders = async () => {
  try {
    const response = await fetch(`${BASE_URL}/orders/all`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching Orders:", error);
    throw error;
  }
};

export const createOrders = async (categoryData) => {
  try {
    const response = await fetch(`${BASE_URL}/Orders/create`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(categoryData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};

export const updateOrders = async (orderId, updatedData) => {
  try {
    const response = await fetch(`${BASE_URL}/orders/update/${orderId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(updatedData),
    });
    if (!response.ok) {
      let errorMessage = `Error updating order: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (e) {
      }
      throw new Error(errorMessage);
    }
    return await response.json();
  } catch (error) {
    console.error("Error updating order:", error);
    throw error;
  }
};


// Upload Product Image with productId
export const uploadProductImage = async (productId, file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("productId", productId);
    const res = await fetch(`${BASE_URL}/products/upload`, {
      method: "POST",
      headers: getAuthHeaders(true),
      body: formData,
    });
    if (!res.ok) {
      const errorText = await res.text();
      console.error("Upload failed response:", errorText);
      throw new Error(`Image upload failed: ${res.status} ${res.statusText}`);
    }
    return await res.json();
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

// Delete Product Image
export const deleteProductImage = async (productId, public_id) => {
  try {
    const response = await fetch(`${BASE_URL}/products/delete-image`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ productId, public_id }),
    });
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Error deleting image:", error);
    throw error;
  }
};


// offer details api 
export const createOffer = async (offerData) => {
  try {
    const response = await fetch(`${BASE_URL}/offers/create`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(offerData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error creating offer:", error);
    throw error;
  }
};

export const getAllOffers = async () => {
  try {
    const response = await fetch(`${BASE_URL}/offers/all`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching offers:", error);
    throw error;
  }
};

export const updateOffer = async (offerId, offerData) => {
  try {
    const response = await fetch(`${BASE_URL}/offers/update/${offerId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(offerData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error updating offer:", error);
    throw error;
  }
};

export const deleteOffer = async (offerId) => {
  try {
    const response = await fetch(`${BASE_URL}/offers/delete/${offerId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error deleting offer:", error);
    throw error;
  }
};
