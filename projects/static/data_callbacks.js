// Function to get original preliminary data from flask endpoint
export async function fetchAllProjects() {
  try {
    const response = await fetch('../data/all_projects');
    const data = await response.json();
    return data;
  } catch (error) {
    return error;
  }
}
