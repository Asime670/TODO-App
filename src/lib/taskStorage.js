const API_URL = "https://agrofarms.cloud/api";

export async function getTasks() {
  try {
    const response = await fetch(`${API_URL}/tasks`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${sessionStorage.getItem('token')}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch tasks");
    }
    const data = await response.json();
    // console.log('Fetched tasks:', data);

    return data[data] || [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function addTask(payload) {
  try {
    const response = await fetch(`${API_URL}/tasks`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${sessionStorage.getItem('token')}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error("Failed to create task");
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateStoredTask(taskId, updates) {
  try {
    const response = await fetch(`${API_URL}/tasks/${taskId}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${sessionStorage.getItem('token')}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error("Failed to update task");
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteStoredTask(taskId) {
  try {
    const response = await fetch(`${API_URL}/tasks/${taskId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${sessionStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete task");
    }

    return true;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getStoredTask(taskId) {
  try {
    const response = await fetch(`${API_URL}/tasks/${taskId}`, {
      headers: {
        "Authorization": `Bearer ${sessionStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch task");
    }
    const data = await response.json();
    
    return data.data || null;
    
  } catch (error) {
    console.error(error);
    return null;
  }
}