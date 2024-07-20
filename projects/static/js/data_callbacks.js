// General content of this file is to interract with the SQL endponits for data retrieval

// Get a single project from the SQL table
export async function fetch_project(id) {
  try {
    let response = await fetch(`../data/project/${id}/`).then((response) =>
      response.json(),
    );
    return response;
  } catch (error) {
    return error;
  }
}

// Get a list of all projects
export async function fetch_project_list() {
  try {
    let response = await fetch("../data/project_list/").then((response) =>
      response.json(),
    );
    return response;
  } catch (error) {
    return error;
  }
}

export async function update_project_param(id, param, value) {
  const data = JSON.stringify({
    id: id,
    param: param,
    value: value,
  });

  try {
    let response = await fetch("../data/update_project_param/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    });
    return response.json();
  } catch (error) {
    return error;
  }
}
