export async function check_user() {
  try {
    let response = await fetch("/session/check_user").then((response) =>
      response.json()
    );
    return response;
  } catch (error) {
    return error;
  }
}
