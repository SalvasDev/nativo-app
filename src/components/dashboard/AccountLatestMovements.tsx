import { Link } from "react-router-dom";
import { Transaction } from "../../interfaces/Transaction";
import { BiChevronDown } from "react-icons/bi";

interface AccountLatestMovementsProps {
  latestMovements: Transaction[];
  accountId: string | null;
}

const AccountLatestMovements: React.FC<AccountLatestMovementsProps> = ({
  latestMovements,
  accountId,
}) => {
  return (
    <>
      <h3>Últimos movimientos</h3>
      <ul className="flex flex-col gap-5 pl-2 pr-6 pt-6">
        {latestMovements ? (
          latestMovements.map((transaction: Transaction) => (
            <li key={transaction.id} className="flex justify-between">
              <div>
                <p>{transaction.creationDate}</p>
                <p>{transaction.transaction}</p>
                <p className="text-sm font-medium">
                  {accountId == transaction.senderAccount
                    ? "Microcrédito de " + transaction.receiverFullName
                    : transaction.senderFullName}
                </p>
              </div>
              <p>
                {accountId == transaction.senderAccount && "-"}$
                {transaction.amount.toLocaleString()}
              </p>
            </li>
          ))
        ) : (
          <p>Sin movimientos</p>
        )}
      </ul>
      {/* CAMBIAR A RUTA DE HISTORIAL COMPLETO */}
      <div className="mt-3 w-full text-end font-medium text-blue-400">
        <Link to={"/"} className="text-xs leading-3">
          Ver más <BiChevronDown className="inline text-2xl" />
        </Link>
      </div>
    </>
  );
};

export default AccountLatestMovements;