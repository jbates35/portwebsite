// Function to get original preliminary data from flask endpoint
export async function fetchAllProjects() {
  try {
    let response = await fetch("../data/all_projects").then((response) =>
      response.json(),
    );
    return response;
  } catch (error) {
    return error;
  }
}
