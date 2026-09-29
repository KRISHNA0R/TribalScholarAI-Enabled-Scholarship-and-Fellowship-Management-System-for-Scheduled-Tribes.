import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useNotification } from '../context/NotificationContext.jsx';
import {
  Zap,
  Play,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Award,
  CreditCard,
  User,
  Sliders,
  Sparkles,
  RefreshCw,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { formatINR } from '../utils/formatters.js';
import { useAccessibility } from '../context/AccessibilityContext.jsx';

const DemoHubPage = () => {
  const { user, switchDemoRole } = useAuth();
  const { addToast } = useNotification();
  const { t } = useAccessibility();
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);

  const demoRoles = [
    {
      role: 'APPLICANT',
      name: 'Rahul Kumar',
      email: 'applicant@demo.com',
      desc: t('demo.role1Desc'),
      path: '/applicant/dashboard',
    },
    {
      role: 'VERIFICATION_OFFICER',
      name: 'Dr. Rameshwar Oraon',
      email: 'verifier@demo.com',
      desc: t('demo.role2Desc'),
      path: '/officer/queue',
    },
    {
      role: 'SELECTION_COMMITTEE',
      name: 'Prof. Arjun Munda',
      email: 'committee@demo.com',
      desc: t('demo.role3Desc'),
      path: '/selection',
    },
    {
      role: 'FINANCE_OFFICER',
      name: 'Shri Sanjeev Kumar',
      email: 'finance@demo.com',
      desc: t('demo.role4Desc'),
      path: '/finance',
    },
    {
      role: 'ADMIN',
      name: 'MoTA System Administrator',
      email: 'admin@demo.com',
      desc: t('demo.role5Desc'),
      path: '/admin/dashboard',
    },
  ];

  const demoScenarios = [
    {
      id: 1,
      title: t('demo.sc1Title'),
      scheme: t('demo.sc1Scheme'),
      desc: t('demo.sc1Desc'),
      badge: t('demo.sc1Badge'),
      badgeColor: 'bg-emerald-100 text-emerald-800',
    },
    {
      id: 2,
      title: t('demo.sc2Title'),
      scheme: t('demo.sc2Scheme'),
      desc: t('demo.sc2Desc'),
      badge: t('demo.sc2Badge'),
      badgeColor: 'bg-amber-100 text-amber-800',
    },
    {
      id: 3,
      title: t('demo.sc3Title'),
      scheme: t('demo.sc3Scheme'),
      desc: t('demo.sc3Desc'),
      badge: t('demo.sc3Badge'),
      badgeColor: 'bg-red-100 text-red-800',
    },
    {
      id: 4,
      title: t('demo.sc4Title'),
      scheme: t('demo.sc4Scheme'),
      desc: t('demo.sc4Desc'),
      badge: t('demo.sc4Badge'),
      badgeColor: 'bg-purple-100 text-purple-800',
    },
    {
      id: 5,
      title: t('demo.sc5Title'),
      scheme: t('demo.sc5Scheme'),
      desc: t('demo.sc5Desc'),
      badge: t('demo.sc5Badge'),
      badgeColor: 'bg-red-100 text-red-900 font-bold',
    },
    {
      id: 6,
      title: t('demo.sc6Title'),
      scheme: t('demo.sc6Scheme'),
      desc: t('demo.sc6Desc'),
      badge: t('demo.sc6Badge'),
      badgeColor: 'bg-blue-100 text-blue-800',
    },
    {
      id: 7,
      title: t('demo.sc7Title'),
      scheme: t('demo.sc7Scheme'),
      desc: t('demo.sc7Desc'),
      badge: t('demo.sc7Badge'),
      badgeColor: 'bg-indigo-100 text-indigo-800',
    },
  ];

  const walkthroughSteps = [
    {
      step: 1,
      title: t('demo.step1Title'),
      actor: t('demo.step1Actor'),
      details: t('demo.step1Details'),
      evidence: 'Rule evaluated: eduLevel IN ["M.Phil", "Ph.D"] AND income <= 800000 -> MATCH',
    },
    {
      step: 2,
      title: t('demo.step2Title'),
      actor: t('demo.step2Actor'),
      details: t('demo.step2Details'),
      evidence: 'Autosaved to MongoDB with application number TS-2025-NFST-1002.',
    },
    {
      step: 3,
      title: t('demo.step3Title'),
      actor: t('demo.step3Actor'),
      details: t('demo.step3Details'),
      evidence: 'Document Hash: sha256-a9b814... (Index recorded in database).',
    },
    {
      step: 4,
      title: t('demo.step4Title'),
      actor: t('demo.step4Actor'),
      details: t('demo.step4Details'),
      evidence: 'Extracted: Name: Rahul Kumar | Certificate: INC/2024/98124.',
    },
    {
      step: 5,
      title: t('demo.step5Title'),
      actor: t('demo.step5Actor'),
      details: t('demo.step5Details'),
      evidence: 'Flag: INCOME_MISMATCH | Severity: CRITICAL | Queue: ATTENTION REQUIRED.',
    },
    {
      step: 6,
      title: t('demo.step6Title'),
      actor: t('demo.step6Actor'),
      details: t('demo.step6Details'),
      evidence: 'Decision: Officer confirms mismatch and raises deficiency.',
    },
    {
      step: 7,
      title: t('demo.step7Title'),
      actor: t('demo.step7Actor'),
      details: t('demo.step7Details'),
      evidence: 'Application stage transitioned to: Deficiency Resolution.',
    },
    {
      step: 8,
      title: t('demo.step8Title'),
      actor: t('demo.step8Actor'),
      details: t('demo.step8Details'),
      evidence: 'Application stage transitioned to: Correction Submitted.',
    },
    {
      step: 9,
      title: t('demo.step9Title'),
      actor: t('demo.step9Actor'),
      details: t('demo.step9Details'),
      evidence: 'All mandatory rules verified: 5/5 PASSED.',
    },
    {
      step: 10,
      title: t('demo.step10Title'),
      actor: t('demo.step10Actor'),
      details: t('demo.step10Details'),
      evidence: 'Rank: #1 in State Merit List &bull; Status: APPROVED.',
    },
    {
      step: 11,
      title: t('demo.step11Title'),
      actor: t('demo.step11Actor'),
      details: t('demo.step11Details'),
      evidence: 'Sanction Amount: ₹4,68,000/- &bull; DBT Batch Generated.',
    },
    {
      step: 12,
      title: t('demo.step12Title'),
      actor: t('demo.step12Actor'),
      details: t('demo.step12Details'),
      evidence: 'Status: DISBURSED &bull; Student notified: "Scholarship Disbursed".',
    },
  ];

  const handleRoleSelect = async (roleObj) => {
    try {
      await switchDemoRole(roleObj.role);
      addToast({
        title: t('demo.toastTitle'),
        message: t('demo.toastMessage', { name: roleObj.name, role: roleObj.role }),
        type: 'success',
      });
      navigate(roleObj.path);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-gov-navy-950 via-gov-navy-900 to-gov-navy-800 text-white rounded-2xl p-6 sm:p-8 shadow-lg space-y-3 border border-slate-800">
        <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold px-3 py-1 rounded-full">
          <Zap className="w-3.5 h-3.5" />
          <span>{t('demo.headerBadge')}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          {t('demo.headerTitle')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          {t('demo.headerSubtitle')}
        </p>
      </div>

      {/* 1. Instant 1-Click Role Switcher */}
      <div className="space-y-3">
        <h2 className="font-bold text-sm text-gov-navy-950 uppercase tracking-wider flex items-center gap-2">
          <User className="w-4 h-4 text-amber-600" />
          {t('demo.section1Title')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {demoRoles.map((r) => (
            <button
              key={r.role}
              onClick={() => handleRoleSelect(r)}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer shadow-xs hover:shadow-md flex flex-col justify-between ${
                user?.role === r.role
                  ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-300'
                  : 'bg-white border-slate-200 hover:border-gov-navy-800'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gov-navy-800 bg-slate-100 px-2 py-0.5 rounded">
                    {r.role.replace(/_/g, ' ')}
                  </span>
                  {user?.role === r.role && (
                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  )}
                </div>
                <div className="font-bold text-xs text-slate-900">{r.name}</div>
                <p className="text-[11px] text-slate-500 leading-snug">{r.desc}</p>
              </div>
              <div className="mt-4 pt-2 border-t border-slate-100 text-[11px] font-bold text-gov-navy-900 flex items-center justify-between">
                <span>{t('demo.switchOpen')}</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-600" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Interactive Automated 12-Step Judge Presentation Stepper */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-600" />
              <h2 className="text-base sm:text-lg font-extrabold text-gov-navy-950">
                {t('demo.section2Title')}
              </h2>
            </div>
            <p className="text-xs text-slate-600">
              {t('demo.section2Desc')}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveStep((prev) => Math.max(1, prev - 1))}
              disabled={activeStep === 1}
              className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
            >
              {t('demo.previousStep')}
            </button>

            <span className="text-xs font-mono font-bold text-slate-600 px-2">
              {t('demo.stepOf', { current: activeStep })}
            </span>

            <button
              onClick={() => setActiveStep((prev) => Math.min(12, prev + 1))}
              disabled={activeStep === 12}
              className="bg-gov-navy-900 hover:bg-gov-navy-800 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg flex items-center gap-1 shadow-xs disabled:opacity-40"
            >
              {t('demo.nextStep')} <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Current Active Step Showcase Card */}
        {(() => {
          const st = walkthroughSteps[activeStep - 1];
          return (
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 space-y-4 animate-in fade-in">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gov-navy-900 text-amber-400 font-bold text-xs flex items-center justify-center">
                    {st.step}
                  </div>
                  <h3 className="font-extrabold text-sm sm:text-base text-gov-navy-950">
                    {st.title}
                  </h3>
                </div>
                <span className="text-xs font-bold text-slate-700 bg-white border border-slate-300 px-2.5 py-1 rounded-md">
                  {t('demo.activeActor', { actor: st.actor })}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                {st.details}
              </p>

              <div className="bg-white rounded-lg p-3.5 border border-slate-200 text-xs font-mono space-y-1">
                <div className="text-[10px] uppercase font-bold text-slate-400">
                  {t('demo.evidenceLabel')}
                </div>
                <div className="text-slate-800">{st.evidence}</div>
              </div>
            </div>
          );
        })()}

        {/* Stepper Dots Bar */}
        <div className="flex items-center justify-between gap-1 overflow-x-auto pt-2">
          {walkthroughSteps.map((st) => (
            <button
              key={st.step}
              onClick={() => setActiveStep(st.step)}
              className={`flex-1 py-1.5 text-center text-[10px] font-bold rounded transition-all cursor-pointer ${
                st.step === activeStep
                  ? 'bg-gov-navy-900 text-white shadow-xs'
                  : st.step < activeStep
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
            >
              {st.step}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Pre-Configured Test Scenarios */}
      <div className="space-y-3">
        <h2 className="font-bold text-sm text-gov-navy-950 uppercase tracking-wider flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {t('demo.section3Title')}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {demoScenarios.map((sc) => (
            <div
              key={sc.id}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-colors space-y-2.5 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${sc.badgeColor}`}>
                    {sc.badge}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {t('demo.scenarioNumber', { id: sc.id })}
                  </span>
                </div>
                <h3 className="font-bold text-xs text-gov-navy-950">{sc.title}</h3>
                <div className="text-[11px] font-semibold text-gov-navy-800">
                  {t('demo.target', { scheme: sc.scheme })}
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">{sc.desc}</p>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <button
                  onClick={() => {
                    addToast({
                      title: t('demo.scenarioLoaded', { title: sc.title }),
                      message: t('demo.scenarioReady'),
                      type: 'info',
                    });
                    navigate('/officer/queue');
                  }}
                  className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-gov-navy-900 font-bold text-xs py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  {t('demo.launchInQueue')} <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DemoHubPage;
