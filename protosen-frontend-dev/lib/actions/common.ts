import { getServerSession } from "next-auth";
import { authOptions } from "../auth/authOptions";
import { mapDate } from "../utils";
import { revalidatePath } from "next/cache";

export const fetchData = async (
  url: string,
  successMessage: string,
  errorMessage: string
) => {
  const session = await getServerSession(authOptions);
  try {
    const token = session?.backendTokens?.accessToken;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });

    // console.log(response);
    var result = await response.json();
    // console.log(result);

    if (response.status !== 200) {
      return {
        message: errorMessage,
        status: "error",
        errors: result,
      };
      // throw new Error(errorMessage);
    }
  } catch (err) {
    // throw new Error(errorMessage);
    console.log(err);
    return {
      message: errorMessage,
      status: "error",
    };
  }
  return {
    data: result.data,
    message: successMessage,
    status: "success",
  };
};

export async function createData(
  url: string,
  dataToSend: unknown,
  schema: any,
  dateFields: string[],
  successMessage: string,
  errorMessage: string,
  pathToRevalidate: string
) {
  const session = await getServerSession(authOptions);

  const token = session?.backendTokens?.accessToken;

  const validatedFields = schema.safeParse(dataToSend);

  // Return early if the form data is invalid
  if (!validatedFields.success) {
    return {
      status: "error",
      message: errorMessage,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  let bodyData = {
    ...validatedFields.data,
    ...mapDate(validatedFields.data, dateFields),
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(bodyData),
    });

    // console.log(response);
    var result = await response.json();
    // console.log(result);

    if (response.status !== 200) {
      return {
        message: errorMessage,
        status: "error",
        errors: result,
      };
      // throw new Error(errorMessage);
    }
    revalidatePath(pathToRevalidate);

    // return result;
  } catch (e) {
    // console.log(e);
    return {
      message: errorMessage,
      status: "error",
    };
    // throw new Error(errorMessage);
  }
  return {
    data: result.data,
    status: "success",
    message: successMessage,
  };
}

export async function updateData(
  url: string,
  dataToSend: unknown,
  schema: any,
  dateFields: string[],
  successMessage: string,
  errorMessage: string,
  pathToRevalidate: string
) {
  const session = await getServerSession(authOptions);

  const token = session?.backendTokens?.accessToken;

  const validatedFields = schema.safeParse(dataToSend);

  // Return early if the form data is invalid
  if (!validatedFields.success) {
    return {
      status: "error",
      message: errorMessage,
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  let bodyData = {
    ...validatedFields.data,
    ...mapDate(validatedFields.data, dateFields),
  };

  try {
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(bodyData),
    });

    var result = await response.json();

    if (response.status !== 200) {
      return {
        message: errorMessage,
        status: "error",
        errors: result,
      };
      // throw new Error(errorMessage);
    }
    revalidatePath(pathToRevalidate);

    // return result;
  } catch (e) {
    return {
      message: errorMessage,
      status: "error",
    };
    // throw new Error(errorMessage);
  }
  return {
    data: result,
    status: "success",
    message: successMessage,
  };
}

export async function validateData(
  url: string,
  formData: FormData,
  successMessage: string,
  errorMessage: string,
  pathToRevalidate: string
) {
  const session = await getServerSession(authOptions);

  const token = session?.backendTokens?.accessToken;

  const object: any = {};

  formData.forEach((value, key) => {
    if (key !== "id") {
      object[key] = value;
    }
  });

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(object),
    });

    var result = await response.json();
    // console.log(result);

    if (response.status !== 200) {
      return {
        message: result?.message || errorMessage,
        status: "error",
        errors: result,
      };
      // throw new Error(errorMessage);
    }
    revalidatePath(pathToRevalidate);

    // return result;
  } catch (e) {
    console.log(e);
    return {
      message: errorMessage,
      status: "error",
    };
    // throw new Error(errorMessage);
  }
  return {
    data: result,
    status: "success",
    message: successMessage,
  };
}

export async function submitData(
  url: string,
  successMessage: string,
  errorMessage: string,
  pathToRevalidate: string
) {
  const session = await getServerSession(authOptions);

  const token = session?.backendTokens?.accessToken;

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });

    var result = await response.json();
    // console.log(response);

    if (response.status !== 200) {
      return {
        message: errorMessage,
        status: "error",
        errors: result,
      };
      // throw new Error(errorMessage);
    }
    revalidatePath(pathToRevalidate);

    // return result;
  } catch (e) {
    console.log(e);
    return {
      message: errorMessage,
      status: "error",
    };
    // throw new Error(errorMessage);
  }
  return {
    data: result,
    status: "success",
    message: successMessage,
  };
}

export const submitDataFiles = async (
  formData: FormData,
  url: string,
  successMessage: string,
  errorMessage: string
) => {
  const session = await getServerSession(authOptions);
  const token = session?.backendTokens?.accessToken;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
      },
      body: formData,
    });
    // console.log(response);

    var result = await response.json();

    // console.log(result);

    if (response.status !== 200) {
      return {
        message: errorMessage,
        status: "error",
      };
      // throw new Error(errorMessage);
    }
  } catch (e) {
    return {
      message: errorMessage,
      status: "error",
    };
    // throw new Error(errorMessage);
  }
  return {
    data: result,
    status: "success",
    message: successMessage,
  };
};

export const updateDataFiles = async (
  formData: FormData,
  url: string,
  successMessage: string,
  errorMessage: string,
  pathToRevalidate: string
) => {
  const session = await getServerSession(authOptions);
  const token = session?.backendTokens?.accessToken;

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token,
      },
      body: formData,
    });
    // console.log(formData);

    var result = await response.json();
    // console.log(result);

    if (response.status !== 200) {
      return {
        message: errorMessage,
        status: "error",
      };
      // throw new Error(errorMessage);
    }
    revalidatePath(pathToRevalidate);
  } catch (e) {
    console.log(e);
    return {
      message: errorMessage,
      status: "error",
    };
    // throw new Error(errorMessage);
  }
  return {
    data: result,
    status: "success",
    message: successMessage,
  };
};

export const deleteDataFiles = async (
  formData: FormData,
  url: string,
  successMessage: string,
  errorMessage: string,
  pathToRevalidate: string
) => {
  const session = await getServerSession(authOptions);
  const token = session?.backendTokens?.accessToken;

  try {
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        fileKeys: [formData.get("fileKeys[]")],
      }),
    });

    var result = await response.json();

    if (response.status !== 200) {
      return {
        message: errorMessage,
        status: "error",
      };
      // throw new Error(errorMessage);
    }
    revalidatePath(pathToRevalidate);
  } catch (e) {
    return {
      message: errorMessage,
      status: "error",
    };
    // throw new Error(errorMessage);
  }
  return {
    data: result,
    status: "success",
    message: successMessage,
  };
};
