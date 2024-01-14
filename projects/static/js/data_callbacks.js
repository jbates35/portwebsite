// General content of this file is to interract with the SQL endponits for data retrieval

// Get a single project from the SQL table
export async function fetch_project(id) {
  try {
    let response = await fetch("../data/project/" + String(id)).then(
      (response) => response.json(),
    );
    return response;
  } catch (error) {
    return error;
  }
}
