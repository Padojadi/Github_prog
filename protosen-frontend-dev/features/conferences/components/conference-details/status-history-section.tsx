import LoadingComponent from "@/components/loadingComponent";
import { useGetConferenceStatusHistory } from "../../hooks/use-get-status-history";
import { Conference } from "../../types";
import Timeline from "./timeline";

type StatusHistorySectionProps = {
  conference: Conference;
};

export function StatusHistorySection({
  conference,
}: StatusHistorySectionProps) {
  const { data, isLoading } = useGetConferenceStatusHistory(conference.id);
  return (
    <>
      {isLoading ? (
        <LoadingComponent />
      ) : (
        <div className="max-w-3xl mx-auto animate-fade-in">
          <div className="bg-white dark:bg-slate-950 rounded-xl border border-border p-6 mb-8">
            <h2 className="text-xl font-bold mb-6">Historique de statut</h2>
            <Timeline items={data?.data ?? []} />
          </div>

          <div className="bg-muted rounded-xl p-6">
            <h3 className="text-lg font-medium mb-3">
              À propos du statut de la conférence
            </h3>
            <p className="text-muted-foreground mb-4">
              Le statut de la conférence indique l'état actuel de la conférence
              dans notre système. Les changements de statut sont automatiquement
              enregistrés et visibles par tous les organisateurs et
              administrateurs.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground mb-4">
              <li className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-[#F59E0B] mr-2"></span>
                <span>
                  <strong>En attente</strong>: La demande de conférence a été
                  soumise mais pas encore approuvée.
                </span>
              </li>
              <li className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-[#3B82F6] mr-2"></span>
                <span>
                  <strong>Acceptée</strong>: La demande de conférence a été
                  approuvée et peut être confirmée
                </span>
              </li>
              <li className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-[#10B981] mr-2"></span>
                <span>
                  <strong>Confirmée</strong>: Toutes les conditions ont été
                  remplies et la conférence peut être créée.
                </span>
              </li>
              <li className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-cyan-500 mr-2"></span>
                <span>
                  <strong>Créée</strong>: La conférence à été créée et peut être
                  visible aux utilisateur pour qu'ils puissent s'inscrire
                </span>
              </li>
              <li className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-[#EF4444] mr-2"></span>
                <span>
                  <strong>Rejetée</strong>: La demande de conférence a été
                  rejetée
                </span>
              </li>
              <li className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-[#EF4444] mr-2"></span>
                <span>
                  <strong>Rejetée définitivement</strong>: La demande de
                  conférence a été rejetée définitivement.
                </span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
