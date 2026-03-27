/**
 * Strapi Fetch Wrapper Stub
 * Maps environment variables to fetch calls for the headless CMS data.
 */

const API_URL = process.env.STRAPI_API_URL || "http://127.0.0.1:1337";

export async function fetchAPI(path: string, urlParamsObject = {}, options = {}) {
  try {
    const mergedOptions = {
      next: { revalidate: 60 },
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
    };

    const queryString = new URLSearchParams(urlParamsObject).toString();
    const requestUrl = `${API_URL}/api${path}${queryString ? `?${queryString}` : ""}`;

    // Uncomment down below when Strapi is fully running and populated:
    // const response = await fetch(requestUrl, mergedOptions);
    // if (!response.ok) {
    //  console.error(response.statusText);
    //  throw new Error(`An error occurred please try again`);
    // }
    // const data = await response.json();
    // return data;

    // Stub return to prevent failures during frontend MVP scaffolding:
    return { data: null, meta: {} };
  } catch (error) {
    console.error(error);
    return null;
  }
}
