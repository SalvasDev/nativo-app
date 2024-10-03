import { useNavigate } from "react-router-dom";
import ApplyMicrocreditForm from "../components/ApplyMicrocreditForm";

const ApplyMicrocreditsPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#E1F0D7] pb-8">
      <article className="flex w-full flex-col items-center justify-center gap-4 bg-[#E1F0D7] py-10">
        <h1 className="w-2/3 text-center text-xl font-bold">
          Gestión de microcréditos.
        </h1>
        <img
          src="./microcredits/personal_finance.png"
          alt="Imagen solicitando microcrédito"
        />
        <h2 className="w-2/3 text-center text-base font-bold">
          Solicitud de Microcréditos
        </h2>
      </article>
      <div className="bg-[#8EC63F] px-8 py-6">
        Te ofrecemos una tasa de interés solidaria y la opción de elegir la
        cantidad de cuotas: una solución adaptada a las necesidades de los
        usuarios rurales.
      </div>
      <section>
        <ApplyMicrocreditForm />
        <div className="mt-12 flex w-full flex-col items-center justify-center gap-5 px-8">
          <h2 className="w-2/3 text-center text-xl font-semibold">
            Ver mi historial de créditos
          </h2>
          <button
            type="submit"
            onClick={() => navigate("/history-microcredits")}
            className="mt-4 h-[42px] w-[80%] rounded-full bg-[#b0b0b0] text-lg font-semibold text-black"
          >
            Ver historial
          </button>
        </div>
      </section>
    </div>
  );
};

export default ApplyMicrocreditsPage;