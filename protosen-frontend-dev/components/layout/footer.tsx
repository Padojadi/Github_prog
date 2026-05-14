import { Mail, Phone, MapPin, ExternalLink } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white">
      {/* Bande tricolore */}
      <div className="h-1 flex">
        <div className="flex-1 bg-[#00853F]" />
        <div className="flex-1 bg-[#FDEF42]" />
        <div className="flex-1 bg-[#E31B23]" />
      </div>

      <div className="container-custom py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo et description */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <img
                src="/images/logo.png"
                alt="Logo Protosen"
                className="h-12 w-auto"
              />
              <div>
                <span className="text-xl font-bold uppercase block">
                  Protosen
                </span>
                <span className="text-xs text-slate-400">
                  République du Sénégal
                </span>
              </div>
            </Link>
            <p className="text-sm text-slate-400 mb-4">
              Plateforme officielle de gestion des conférences et événements
              gouvernementaux de la République du Sénégal.
            </p>
            <p className="text-xs text-slate-500 italic">
              "Un Peuple - Un But - Une Foi"
            </p>
          </div>

          {/* Liens rapides */}
          <div>
            <h4 className="text-base font-semibold mb-4 text-white">
              Accès Rapide
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/conferences"
                  className="text-slate-400 hover:text-[#FDEF42] transition-colors text-sm"
                >
                  Conférences
                </Link>
              </li>
              <li>
                <Link
                  href="/conferences/participant-gateway"
                  className="text-slate-400 hover:text-[#FDEF42] transition-colors text-sm"
                >
                  Espace Participant
                </Link>
              </li>
              <li>
                <Link
                  href="/conferences/verify-ticket"
                  className="text-slate-400 hover:text-[#FDEF42] transition-colors text-sm"
                >
                  Vérifier un Ticket
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-slate-400 hover:text-[#FDEF42] transition-colors text-sm"
                >
                  À propos
                </Link>
              </li>
            </ul>
          </div>

          {/* Informations légales */}
          <div>
            <h4 className="text-base font-semibold mb-4 text-white">
              Informations Légales
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/mentions-legales"
                  className="text-slate-400 hover:text-[#FDEF42] transition-colors text-sm"
                >
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link
                  href="/confidentialite"
                  className="text-slate-400 hover:text-[#FDEF42] transition-colors text-sm"
                >
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link
                  href="/conditions"
                  className="text-slate-400 hover:text-[#FDEF42] transition-colors text-sm"
                >
                  Conditions d'utilisation
                </Link>
              </li>
              <li>
                <Link
                  href="/accessibilite"
                  className="text-slate-400 hover:text-[#FDEF42] transition-colors text-sm"
                >
                  Accessibilité
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-base font-semibold mb-4 text-white">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-slate-400 text-sm">
                <Mail className="w-4 h-4 text-[#00853F]" />
                <a
                  href="mailto:contact@protosen.gouv.sn"
                  className="hover:text-[#FDEF42] transition-colors"
                >
                  contact@protosen.gouv.sn
                </a>
              </li>
              <li className="flex items-center gap-2 text-slate-400 text-sm">
                <Phone className="w-4 h-4 text-[#00853F]" />
                <a
                  href="tel:+221338899900"
                  className="hover:text-[#FDEF42] transition-colors"
                >
                  +221 33 889 99 00
                </a>
              </li>
              <li className="flex items-start gap-2 text-slate-400 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 text-[#00853F]" />
                <span>
                  Building Administratif
                  <br />
                  Dakar, Sénégal
                </span>
              </li>
            </ul>

            {/* Liens externes */}
            <div className="mt-6">
              <a
                href="https://www.gouv.sn"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-[#FDEF42] hover:underline"
              >
                Portail du Gouvernement
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Ligne de séparation */}
        <div className="border-t border-slate-800 mt-10 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} PROTOSEN - République du Sénégal.
              Tous droits réservés.
            </p>
            <div className="flex items-center gap-6">
              <Link
                href="/confidentialite"
                className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
              >
                Confidentialité
              </Link>
              <Link
                href="/conditions"
                className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
              >
                Conditions
              </Link>
              <Link
                href="/plan-du-site"
                className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
              >
                Plan du site
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
