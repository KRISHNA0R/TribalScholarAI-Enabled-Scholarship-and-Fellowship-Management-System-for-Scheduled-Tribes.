import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, CheckCircle } from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext.jsx';

const Footer = () => {
  const { t } = useAccessibility();

  return (
    <footer className="bg-gov-navy-950 text-slate-300 text-sm border-t-4 border-gov-navy-800">
      {/* Subtle tribal divider strip */}
      <div className="tribal-divider" aria-hidden="true"></div>

      {/* Upper disclaimer strip */}
      <div className="bg-amber-950/40 border-b border-amber-900/40 py-2.5 px-4 text-center text-xs text-amber-300 font-medium">
        <span>{t('footer.demoNotice')}</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Portal Info + Logo */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2.5 text-white font-extrabold text-lg tracking-tight">
              <img
                src="/logotri.png"
                alt="TribalScholar AI logo"
                width={36}
                height={36}
                loading="lazy"
                className="w-9 h-9 rounded-lg object-contain bg-white p-0.5"
              />
              <span>TribalScholar AI</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t('footer.brandDesc')}
            </p>
            <div className="text-xs text-slate-500 pt-2 border-t border-slate-800">
              {t('footer.ministryAddr')}
            </div>
          </div>

          {/* Column 2: Supported Schemes */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">
              {t('footer.officialSchemes')}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              {[1, 2, 3, 4, 5].map((n) => (
                <li key={n}>
                  <Link to="/schemes" className="hover:text-amber-400 transition-colors">
                    {t(`footer.scheme${n}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Quick Navigation */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">
              {t('footer.portals')}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/schemes?finder=true" className="hover:text-amber-400 transition-colors">
                  {t('footer.findScholarship')}
                </Link>
              </li>
              <li>
                <Link to="/demo" className="hover:text-amber-400 transition-colors font-medium text-amber-300">
                  {t('footer.sihSuite')}
                </Link>
              </li>
              <li>
                <Link to="/applicant/help" className="hover:text-amber-400 transition-colors">
                  {t('footer.grievance')}
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-amber-400 transition-colors">
                  {t('footer.privacyPolicy')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Official References */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">
              {t('footer.references')}
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <a
                  href="https://tribal.nic.in/ScholarshiP.aspx"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-amber-400 flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                  MoTA Scholarship Portal
                </a>
              </li>
              <li>
                <a
                  href="https://dbttribal.gov.in/AllScheme.aspx"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-amber-400 flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                  DBT Tribal Schemes Portal
                </a>
              </li>
              <li>
                <span className="inline-block bg-slate-800 text-slate-300 px-2 py-1 rounded text-[11px]">
                  {t('footer.dbtBadge')}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright & credits */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>
            &copy; {new Date().getFullYear()} TribalScholar AI &bull; {t('footer.rights')}
          </p>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1 text-emerald-400">
              <CheckCircle className="w-3.5 h-3.5" />
              {t('footer.wcag')}
            </span>
            <span>&bull;</span>
            <span className="text-slate-400">{t('footer.nicStandards')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
