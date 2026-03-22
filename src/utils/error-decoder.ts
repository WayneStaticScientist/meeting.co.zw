export interface ConnectionError {
  message: string;
  status: number;
}
export function decodeFromAxios(error: any): ConnectionError {
  if (error.response) {
    const status = error.response.status;
    if (status === 404) {
      return {
        message: "The requested resource was not found.",
        status: 404,
      };
    } else if (status === 400) {
      return {
        message: error.response.data.message || "Bad Request.",
        status: 400,
      };
    } else if (status === 500) {
      return {
        message: "Internal Server Error. Please try again later.",
        status: 500,
      };
    } else if (status === 401) {
      return {
        message: "Unauthorized. Please log in again.",
        status: 401,
      };
    } else {
      return {
        message: "An unexpected error occurred.",
        status: 501,
      };
    }
  } else if (error.request) {
    return {
      message: "No response received from the server.",
      status: 501,
    };
  } else {
    return {
      message: "An unexpected error occurred.",
      status: 501,
    };
  }
}
