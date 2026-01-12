export const HEADS = [
  {
    id: "userId",
    label: "ID",
    sortable: true,
  },
  {
    id: "email",
    label: "Email",
    sortable: true,
  },
  {
    id: "phone",
    label: "Numéro de téléphone",
    sortable: true,
  },
  {
    id: "parent",
    label: "Compte Parent",
  },
  {
    id: "isActive",
    label: "Actif ",
  },
  {
    id: "activationDate",
    label: "Date d'activation",
    sortable: true,
  },
  {
    id: "numberOfDevices",
    label: "Nombre d'écrans",
    sortable: true,
  },
  {
    id: "totalStorageSize",
    label: "Stockage utilisé",
    sortable: true,
  },
  {
    id: "maxUploadSize",
    label: "Limite d'upload",
    sortable: true,
  },
  {
    id: "actions",
    label: "Actions",
    sortable: false,
  },
];

export const sort = (
  arr: any[],
  sortKey: string,
  sortOrder: "asc" | "desc"
) => {
  var arr_copy = arr.concat();

  if (sortOrder === "asc") {
    arr_copy.sort((c1, c2) => {
      var v1 = c1[`${sortKey}`],
        v2 = c2[`${sortKey}`];
      return v1 > v2 ? 1 : v1 === v2 ? 0 : -1;
    });
  } else {
    arr_copy.sort((c1, c2) => {
      var v1 = c1[`${sortKey}`],
        v2 = c2[`${sortKey}`];
      return v1 > v2 ? -1 : v1 === v2 ? 0 : 1;
    });
  }
  return arr_copy;
};

export function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return "0 octets";

  const k = 1000;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["octets", "Ko", "Mo", "Go", "To", "Po", "Eo", "Zo", "Yo"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export function formatBits(bits: number, decimals = 2) {
  if (bits === 0) return "0 octets";

  let bytes = bits / 8;

  const k = 1000;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["octets", "Ko", "Mo", "Go", "To", "Po", "Eo", "Zo", "Yo"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export function deleteUser(
  userId: number,
  token: string,
  resultHandler: { onSuccess: () => void; onFailure: () => void }
) {
  fetch(
    `https://www.powersmartscreen.com/admin-modify-user?token=${token}&operation=delete&userId=${userId}`
  )
    .then((res) => res.json())
    .then((resJson) => {
      if (resJson.success) {
        resultHandler.onSuccess();
      } else {
        resultHandler.onFailure();
      }
    });
}

export function activateUser(
  userId: number,
  token: string,
  resultHandler: { onSuccess: () => void; onFailure: () => void }
) {
  fetch(
    `https://www.powersmartscreen.com/admin-modify-user?token=${token}&operation=activate&userId=${userId}`
  )
    .then((res) => res.json())
    .then((resJson) => {
      if (resJson.success) {
        resultHandler.onSuccess();
      } else {
        resultHandler.onFailure();
      }
    });
}

export function deactivateUser(
  userId: number,
  token: string,
  resultHandler: { onSuccess: () => void; onFailure: () => void }
) {
  fetch(
    `https://www.powersmartscreen.com/admin-modify-user?token=${token}&operation=deactivate&userId=${userId}`
  )
    .then((res) => res.json())
    .then((resJson) => {
      if (resJson.success) {
        resultHandler.onSuccess();
      } else {
        resultHandler.onFailure();
      }
    });
}

export function changeUserMaxUploadSize (
  userId: number,
  token: string,
  newMaxUploadSize: number,
  resultHandler: { onSuccess: () => void; onFailure: () => void }
) {
  fetch(
    `https://www.powersmartscreen.com/admin-modify-user?token=${token}&operation=change-upload-size&userId=${userId}&maxUploadSize=${newMaxUploadSize}`
  )
    .then((res) => res.json())
    .then((resJson) => {
      if (resJson.success) {
        resultHandler.onSuccess();
      } else {
        resultHandler.onFailure();
      }
    });
}