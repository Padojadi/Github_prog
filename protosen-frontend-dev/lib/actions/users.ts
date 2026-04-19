"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth/authOptions";
import { Backend_URL } from "../constants";
import { revalidatePath } from "next/cache";
import { fetchData } from "./common";

export const fetchUsers = async () => {
  const session = await getServerSession(authOptions);
  try {
    const token = session?.backendTokens?.accessToken;
    const result = await fetch(`${Backend_URL}/user/all`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    const res = await result.json();

    // Format the createdAt and updatedAt fields in res?.data?.rows
    if (res?.data?.rows) {
      res.data.rows = res.data.rows.map((row: any) => {
        row.createdAt = new Date(row.createdAt).toLocaleString();
        row.updatedAt = new Date(row.updatedAt).toLocaleString();
        return row;
      });
    }

    return {
      data: res.data,
      message: "User infos fetched successfully",
      status: "success",
    };
  } catch (err) {
    // throw new Error("Failed to fetch holder info");
    return {
      message: "Failed to fetch user infos",
      status: "error",
    };
  }
};

export const fetchUserDetails = async (id: string) => {
  const res = await fetchData(
    `${Backend_URL}/user/${id}`,
    "User infos fetched successfully",
    "Failed to fetch user infos"
  );
  return res;
};

export const fetchCurrentUser = async () => {
  const res = await fetchData(
    `${Backend_URL}/user`,
    "User infos fetched successfully",
    "Failed to fetch user infos"
  );
  return res;
};

export async function createNewUser(formData: FormData) {
  const session = await getServerSession(authOptions);

  const token = session?.backendTokens?.accessToken;

  const object: any = {};
  formData.forEach((value, key) => {
    object[key] = value;
  });
  if (!object.role) {
    object.role = "user";
  }

  try {
    const response = await fetch(`${Backend_URL}/auth/super_admin/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(object),
    });
    var result = await response.json();

    if (response.status !== 200) {
      return {
        message:
          result?.message || "Erreur lors de la creation de l'utilisateur",
        status: "error",
        errors: result,
      };
      // throw new Error("Failed to create new user");
    }
    revalidatePath("/panel/users");

    // return result;
  } catch (e) {
    return {
      message: "Erreur lors de la creation de l'utilisateur",
      status: "error",
    };
    // throw new Error("Failed to create new user");
  }
  return {
    data: result,
    status: "success",
    message: "Nouvel utilisateur creé avec succès",
  };
}

// export async function createNewUserNoForm(user: any) {
//   const session = await getServerSession(authOptions);

//   const token = session?.backendTokens?.accessToken;

//   // const object: any = {};
//   // formData.forEach((value, key) => {
//   //   object[key] = value;
//   // });

//   try {
//     const response = await fetch(`${Backend_URL}/auth/super_admin/register`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: "Bearer " + token,
//       },
//       body: JSON.stringify(user),
//     });
//     var result = await response.json();

//     if (response.status !== 200) {
//       return {
//         message: "Failed to create new user1",
//         status: "error",
//         errors: result,
//       };
//       // throw new Error("Failed to create new user");
//     }
//     revalidatePath("/users");

//     // return result;
//   } catch (e) {
//     return {
//       message: "Failed to create new user",
//       status: "error",
//     };
//     // throw new Error("Failed to create new user");
//   }
//   return {
//     data: result,
//     status: "success",
//     message: "New user created successfully",
//   };
// }

export async function updateUser(formData: FormData) {
  const session = await getServerSession(authOptions);

  const token = session?.backendTokens?.accessToken;

  const id = formData.get("userId");

  const object: any = {};
  formData.forEach((value, key) => {
    if (key !== "userId") {
      object[key] = value;
    }
  });

  try {
    const response = await fetch(
      `${Backend_URL}/user/super_admin/update/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(object),
      }
    );
    var result = await response.json();

    if (response.status !== 200) {
      return {
        message: "Erreur lors de la mise à jour de l'utilisateur",
        status: "error",
        errors: result,
      };
      // throw new Error("Failed to update user");
    }
    revalidatePath("/panel/users");

    // return result;
  } catch (e) {
    return {
      message: "Erreur lors de la mise à jour de l'utilisateur",
      status: "error",
    };
    // throw new Error("Failed to update user");
  }
  return {
    data: result,
    status: "success",
    message: "utilisateur mis à jour avec succès",
  };
}

export async function updateCurrentUser(formData: FormData) {
  const session = await getServerSession(authOptions);

  const token = session?.backendTokens?.accessToken;

  const object: any = {};
  formData.forEach((value, key) => {
    object[key] = value;
  });

  try {
    const response = await fetch(`${Backend_URL}/user`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(object),
    });
    var result = await response.json();

    if (response.status !== 200) {
      return {
        message: "Erreur lors de la mise à jour de vos données",
        status: "error",
        errors: result,
      };
      // throw new Error("Failed to update your data");
    }
  } catch (e) {
    return {
      message: "Erreur lors de la mise à jour de vos données",
      status: "error",
    };
    // throw new Error("Failed to update your data");
  }
  return {
    data: result,
    status: "success",
    message: "Informations mises à jour avec succès",
  };
}

export async function deleteUser(id: string) {
  const session = await getServerSession(authOptions);
  const token = session?.backendTokens?.accessToken;

  try {
    const response = await fetch(
      `${Backend_URL}/user/super_admin/delete/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    );
    var result = await response.json();

    if (response.status !== 200) {
      return {
        message: "Erreur lors de la suppression de l'utilisateur",
        status: "error",
        errors: result,
      };
      // throw new Error("Failed to delete user");
    }
    revalidatePath("/panel/users");

    // return result;
  } catch (e) {
    return {
      message: "Erreur lors de la suppression de l'utilisateur",
      status: "error",
    };
    // throw new Error("Failed to delete user");
  }
  return {
    data: result,
    status: "success",
    message: "Utilisateur supprimé avec succès",
  };
}

export async function updateUserPassword(formData: FormData) {
  const session = await getServerSession(authOptions);

  const token = session?.backendTokens?.accessToken;

  const object: any = {};
  formData.forEach((value, key) => {
    object[key] = value;
  });

  try {
    const response = await fetch(
      `${Backend_URL}/user/admin-reset_user_password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(object),
      }
    );
    var result = await response.json();

    if (response.status !== 200) {
      return {
        message: "Erreur lors de la modification du mot de passe",
        status: "error",
        errors: result,
      };
      // throw new Error("Failed to create new user");
    }
    revalidatePath("/panel/users");

    // return result;
  } catch (e) {
    return {
      message: "Erreur lors de la modification du mot de passe",
      status: "error",
    };
    // throw new Error("Failed to create new user");
  }
  return {
    data: result,
    status: "success",
    message: "Mot de passe modifié avec succès",
  };
}
