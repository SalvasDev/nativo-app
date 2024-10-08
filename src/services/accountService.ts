import { Transaction } from "../interfaces/Transaction";
import useUserStore from "../store/useUserStore";

const api = import.meta.env.VITE_API_URL;

export async function getAccountInformation(id: string) {
  try {
    const token = useUserStore.getState().token;

    const response = await fetch(`${api}/api/cuenta/consultar-saldo/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      return await response.json();
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error al buscar información de la cuenta:", error);
    return null;
  }
}

export async function addMoneyToAccount(id: string, amount: number) {
  try {
    const token = useUserStore.getState().token;

    const response = await fetch(`${api}/api/cuenta/agregar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id,
        amount,
      }),
    });

    if (response.ok) {
      return await response.json();
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error al cargar dinero en la cuenta:", error);
    return null;
  }
}

export async function getAccountHistory() {
  try {
    const token = useUserStore.getState().token;
    const accountId = useUserStore.getState().user?.accountId;

    const response = await fetch(`${api}/api/cuenta/historial/todo`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok && accountId != null) {
      const transactions = await response.json();

      return transactions.map((transaction: Transaction) =>
        normalizeTransaction(transaction, accountId),
      );
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error al buscar historial de la cuenta:", error);
    return null;
  }
}

export async function getLatestHistoryByAccount() {
  try {
    const token = useUserStore.getState().token;
    const accountId = useUserStore.getState().user?.accountId;

    const today = new Date();
    const fromDate = new Date();
    fromDate.setDate(today.getDate() - 15);

    const formatDate = (date: Date) => date.toISOString().split("T")[0];
    const fromDateFormatted = formatDate(fromDate);
    const toDateFormatted = formatDate(today);

    const response = await fetch(
      `${api}/api/cuenta/historial/fechas/${fromDateFormatted}/${toDateFormatted}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.ok && accountId != null) {
      const transactions = await response.json();

      const normalizedTransactions = transactions
        .map((transaction: Transaction) =>
          normalizeTransaction(transaction, accountId),
        )
        .slice(0, 5);
      console.log(normalizedTransactions);
      return normalizedTransactions;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error al buscar historial de la cuenta:", error);
    return null;
  }
}

export async function getAccountHistoryByStatus(status: string) {
  try {
    const token = useUserStore.getState().token;
    const accountId = useUserStore.getState().user?.accountId;

    const response = await fetch(
      `${api}/api/cuenta/historial/estado/${status}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (response.ok && accountId != null) {
      const transactions = await response.json();

      return transactions.map((transaction: Transaction) =>
        normalizeTransaction(transaction, accountId),
      );
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error al buscar historial de la cuenta:", error);
    return null;
  }
}

export async function getAccountHistoryByDates(
  fromDate: string,
  toDate: string,
) {
  try {
    const token = useUserStore.getState().token;
    const accountId = useUserStore.getState().user?.accountId;

    const response = await fetch(
      `${api}/api/cuenta/historial/fechas/${fromDate}/${toDate}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.ok && accountId != null) {
      const transactions = await response.json();

      return transactions.map((transaction: Transaction) =>
        normalizeTransaction(transaction, accountId),
      );
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error al buscar historial de la cuenta:", error);
    return null;
  }
}

function normalizeTransaction(transaction: Transaction, accountId: string) {
  const formattedDate = new Date(transaction.creationDate).toLocaleDateString(
    "es-ES",
    {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    },
  );

  const receiverFullName = `${transaction.receiverName} ${transaction.receiverSurname}`;
  const senderFullName = `${transaction.senderName} ${transaction.senderSurname}`;

  let newTransactionType;
  let description = "";

  switch (transaction.transaction) {
    case "Microcrédito":
      newTransactionType =
        transaction.senderAccount === accountId
          ? "Colaboración enviada"
          : "Colaboración recibida";
      description =
        transaction.senderAccount === accountId
          ? `Microcrédito a ${receiverFullName}`
          : `Colaboración recibida de ${senderFullName}`;
      break;

    case "Donación":
      newTransactionType =
        transaction.senderAccount === accountId
          ? "Donación enviada"
          : "Donación recibida";
      description =
        transaction.senderAccount === accountId
          ? `A ${receiverFullName}`
          : senderFullName.includes("null")
            ? "De donante anónimo"
            : `De ${senderFullName}`;
      break;

    case "Pago":
      newTransactionType =
        transaction.senderAccount === accountId
          ? "Donación enviada"
          : "Donación recibida";
      description =
        transaction.senderAccount === accountId
          ? `A ${receiverFullName}`
          : senderFullName.includes("null")
            ? "De donante anónimo"
            : `De ${senderFullName}`;
      break;

    default:
      newTransactionType = transaction.transaction;
      description =
        transaction.senderAccount === accountId
          ? `A ${receiverFullName}`
          : senderFullName.includes("null")
            ? "Desde anónimo"
            : `Desde ${senderFullName}`;
      break;
  }

  return {
    ...transaction,
    transaction: newTransactionType,
    creationDate: formattedDate,
    description,
  };
}

export default {
  getAccountInformation,
  addMoneyToAccount,
  getAccountHistory,
  getLatestHistoryByAccount,
  getAccountHistoryByStatus,
  getAccountHistoryByDates,
};