import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Lock,
  FileCheck2,
  Database,
  EyeOff,
  UserCheck,
  CheckCircle2,
  ExternalLink,
  Zap,
} from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext.jsx';

const PrivacySecurityPage = () => {
  const { t } = useAccessibility();
  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-gov-navy-950 via-gov-navy-900 to-gov-navy-800 text-white rounded-2xl p-6 sm:p-8 shadow-lg space-y-3 border border-slate-800">
        <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full">
          <ShieldCheck className="w-4 h-4" />
          <span>{t('privacy.badge')}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          {t('privacy.title')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          {t('privacy.subtitle')}
        </p>
      </div>

      {/* Core Security Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pillar 1: Aadhaar Data Vault */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
            <EyeOff className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900">
            {t('privacy.pillar1Title')}
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            {t('privacy.pillar1Desc1')}<code className="bg-slate-100 text-gov-navy-900 px-1 py-0.5 rounded font-mono">XXXX-XXXX-8921</code>{t('privacy.pillar1Desc2')}
          </p>
        </div>

        {/* Pillar 2: SHA-256 Hashing */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900">
            {t('privacy.pillar2Title')}
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            {t('privacy.pillar2Desc')}
          </p>
        </div>

        {/* Pillar 3: Role-Based Access Control */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
            <UserCheck className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900">
            {t('privacy.pillar3Title')}
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            {t('privacy.pillar3Desc')}
          </p>
        </div>

        {/* Pillar 4: Immutable Audit Trail */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-slate-900">
            {t('privacy.pillar4Title')}
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            {t('privacy.pillar4Desc')}
          </p>
        </div>
      </div>

      {/* DPDP Act 2023 Principles Table */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
          {t('privacy.dpdpHeading')}
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-700">
                <th className="p-3 font-bold">{t('privacy.thPrinciple')}</th>
                <th className="p-3 font-bold">{t('privacy.thMechanism')}</th>
                <th className="p-3 font-bold">{t('common.status')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-600">
              <tr>
                <td className="p-3 font-semibold text-slate-900">{t('privacy.row1Principle')}</td>
                <td className="p-3">{t('privacy.row1Mechanism')}</td>
                <td className="p-3 text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {t('privacy.enforced')}
                </td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-900">{t('privacy.row2Principle')}</td>
                <td className="p-3">{t('privacy.row2Mechanism')}</td>
                <td className="p-3 text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {t('privacy.enforced')}
                </td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-900">{t('privacy.row3Principle')}</td>
                <td className="p-3">{t('privacy.row3Mechanism')}</td>
                <td className="p-3 text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {t('privacy.enforced')}
                </td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-900">{t('privacy.row4Principle')}</td>
                <td className="p-3">{t('privacy.row4Mechanism')}</td>
                <td className="p-3 text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {t('privacy.enforced')}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Evaluator CTA */}
      <div className="bg-amber-50 rounded-xl border border-amber-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="font-bold text-sm text-amber-950 flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-700" />
            {t('privacy.ctaTitle')}
          </div>
          <p className="text-xs text-amber-800">
            {t('privacy.ctaDesc')}
          </p>
        </div>
        <Link
          to="/demo"
          className="bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs px-4 py-2.5 rounded-lg shadow-xs transition-colors self-start sm:self-auto whitespace-nowrap"
        >
          {t('privacy.ctaButton')} &rarr;
        </Link>
      </div>
    </div>
  );
};

export default PrivacySecurityPage;
