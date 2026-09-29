import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import {
  GraduationCap,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  FileCheck,
  AlertTriangle,
  Award,
  CreditCard,
  Search,
  Users,
  Building2,
  TrendingUp,
  Cpu,
  Eye,
  FileText,
  Clock,
  Sparkles,
  HelpCircle,
  ChevronRight,
  Lock,
  ExternalLink,
} from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext.jsx';

const LandingPage = () => {
  const { t } = useAccessibility();
  const [schemes, setSchemes] = useState([]);
  const [activeFaq, setActiveFaq] = useState(null);
  const [finderForm, setFinderForm] = useState({
    educationLevel: 'Undergraduate',
    annualFamilyIncome: '200000',
    studyLocation: 'India',
  });
  const [finderResults, setFinderResults] = useState(null);
  const [finding, setFinding] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        const res = await api.get('/schemes');
        if (res.success) setSchemes(res.data || []);
      } catch (err) {
        console.error('Failed to load schemes:', err);
      }
    };
    fetchSchemes();
  }, []);

  const handleFinderSubmit = async (e) => {
    e.preventDefault();
    setFinding(true);
    try {
      const res = await api.post('/schemes/recommend', finderForm);
      if (res.success) {
        setFinderResults(res.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setFinding(false);
    }
  };

  const faqs = [
    {
      q: t('landing.faq1Q'),
      a: t('landing.faq1A'),
    },
    {
      q: t('landing.faq2Q'),
      a: t('landing.faq2A'),
    },
    {
      q: t('landing.faq3Q'),
      a: t('landing.faq3A'),
    },
    {
      q: t('landing.faq4Q'),
      a: t('landing.faq4A'),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-gov-navy-950 via-gov-navy-900 to-gov-navy-800 text-white pt-14 pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        {/* Government portal banner backdrop (banner.jpg) — kept very faint (~15% opacity) */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.15]"
          style={{ backgroundImage: "url('/banner.jpg')" }}
          aria-hidden="true"
        ></div>
        {/* Legibility overlay — gentle, banner stays subtle but visible */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-gov-navy-950/45 via-gov-navy-950/35 to-gov-navy-950/60"
          aria-hidden="true"
        ></div>
        {/* Soft vignette behind the headline block for extra contrast */}
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(11,43,26,0.35)_0%,transparent_70%)]"
          aria-hidden="true"
        ></div>
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{t('landing.heroBadge')}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              {t('landing.heroTitleLine1')} <br />
              <span className="bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent">
                {t('landing.heroTitleLine2')}
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal max-w-2xl mx-auto">
              {t('landing.heroSubtitle')}
            </p>

            {/* Hero CTAs */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3.5">
              <a
                href="#finder"
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-3 rounded-lg shadow-lg flex items-center gap-2 text-sm transition-all transform hover:-translate-y-0.5"
              >
                <Search className="w-4 h-4" />
                {t('landing.findMyScheme')}
              </a>

              <Link
                to="/register"
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-5 py-3 rounded-lg text-sm transition-all flex items-center gap-2 backdrop-blur-xs"
              >
                <span>{t('landing.applicantRegistration')}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/demo"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-3 rounded-lg shadow-md flex items-center gap-2 text-sm transition-all"
              >
                <Zap className="w-4 h-4" />
                {t('landing.judgeDemoHub')}
              </Link>
            </div>
          </div>

          {/* Key Impact Metrics Bar */}
          <div className="mt-14 pt-8 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-extrabold text-white">50,000+</div>
              <div className="text-xs text-slate-400 font-medium">{t('landing.metric1Label')}</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">₹14.85 Cr</div>
              <div className="text-xs text-slate-400 font-medium">{t('landing.metric2Label')}</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">97.2%</div>
              <div className="text-xs text-slate-400 font-medium">{t('landing.metric3Label')}</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-extrabold text-white">100%</div>
              <div className="text-xs text-slate-400 font-medium">{t('landing.metric4Label')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive "Find the Right Scholarship" Scheme Discovery Widget */}
      <section id="finder" className="py-12 bg-slate-100 border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6 sm:p-8">
            <div className="flex items-center gap-2.5 mb-2 text-gov-navy-900 font-bold text-lg">
              <Sparkles className="w-5 h-5 text-amber-600" />
              <h2>{t('landing.finderTitle')}</h2>
            </div>
            <p className="text-xs text-slate-600 mb-6">
              {t('landing.finderSubtitle')}
            </p>

            <form onSubmit={handleFinderSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('landing.educationLevelLabel')}
                </label>
                <select
                  value={finderForm.educationLevel}
                  onChange={(e) => setFinderForm({ ...finderForm, educationLevel: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                >
                  <option value="Class 10">{t('landing.eduLevelClass10')}</option>
                  <option value="Class 12">{t('landing.eduLevelClass12')}</option>
                  <option value="Undergraduate">{t('landing.eduLevelUndergraduate')}</option>
                  <option value="Postgraduate">{t('landing.eduLevelPostgraduate')}</option>
                  <option value="Ph.D">{t('landing.eduLevelPhd')}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('landing.incomeLabel')}
                </label>
                <select
                  value={finderForm.annualFamilyIncome}
                  onChange={(e) => setFinderForm({ ...finderForm, annualFamilyIncome: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                >
                  <option value="150000">{t('landing.incomeUpto150000')}</option>
                  <option value="250000">{t('landing.incomeUpto250000')}</option>
                  <option value="450000">{t('landing.incomeUpto450000')}</option>
                  <option value="600000">{t('landing.incomeUpto600000')}</option>
                  <option value="800000">{t('landing.incomeUpto800000')}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t('landing.studyLocationLabel')}
                </label>
                <select
                  value={finderForm.studyLocation}
                  onChange={(e) => setFinderForm({ ...finderForm, studyLocation: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                >
                  <option value="India">{t('landing.studyIndia')}</option>
                  <option value="Abroad">{t('landing.studyAbroad')}</option>
                </select>
              </div>

              <div className="sm:col-span-3 flex items-center justify-between pt-2">
                <span className="text-[11px] text-slate-500 italic">
                  {t('landing.finderNote')}
                </span>
                <button
                  type="submit"
                  disabled={finding}
                  className="bg-gov-navy-900 hover:bg-gov-navy-800 text-white font-bold text-xs px-5 py-2.5 rounded-lg flex items-center gap-2 shadow-xs cursor-pointer transition-colors"
                >
                  {finding ? t('landing.evaluatingRules') : t('landing.checkEligibleSchemes')}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>

            {/* Recommendation results display */}
            {finderResults && (
              <div className="mt-6 pt-6 border-t border-slate-200 space-y-3">
                <div className="font-bold text-xs uppercase tracking-wider text-slate-700">
                  {t('landing.recommendedHeading')}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {finderResults.slice(0, 4).map((rec) => (
                    <div
                      key={rec.scheme._id}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white transition-all space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-bold text-xs text-gov-navy-900">
                          {rec.scheme.schemeName}
                        </h4>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            rec.decision === 'ELIGIBLE'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {rec.decision === 'ELIGIBLE'
                            ? t('landing.potentiallyEligible')
                            : t('landing.manualReview')}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 line-clamp-2">
                        {rec.scheme.description}
                      </p>
                      <div className="text-[11px] text-emerald-700 font-medium">
                        {t('landing.benefitLabel')}{' '}
                        {rec.scheme.financialBenefits?.benefitSummary || t('landing.benefitFallback')}
                      </div>
                      <div className="pt-2 flex items-center justify-between">
                        <span className="text-[10px] text-slate-500 font-semibold">
                          {t('landing.matchScore', { score: rec.matchScore })}
                        </span>
                        <Link
                          to="/applicant/application/new"
                          state={{ schemeId: rec.scheme._id }}
                          className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1"
                        >
                          {t('common.applyNow')} <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3. Official Supported Schemes Showcase */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-700">
            {t('landing.portalDirectory')}
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            {t('landing.supportedSchemes')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            {t('landing.supportedSchemesDesc')}
          </p>
        </div>

        {/* Official banner crops at staggered positions — same local banner.jpg, different crops/positions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10" aria-hidden="true">
          <img src="/banner.jpg" alt="" loading="lazy" width="640" height="235" className="w-full h-32 sm:h-36 object-cover object-left rounded-xl border border-slate-200 shadow-xs" />
          <img src="/banner.jpg" alt="" loading="lazy" width="640" height="235" className="w-full h-32 sm:h-36 object-cover object-center rounded-xl border border-slate-200 shadow-xs sm:translate-y-3" />
          <img src="/banner.jpg" alt="" loading="lazy" width="640" height="235" className="w-full h-32 sm:h-36 object-cover object-right rounded-xl border border-slate-200 shadow-xs" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schemes.map((scheme) => (
            <div
              key={scheme._id}
              className="bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow p-6 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold bg-gov-navy-50 text-gov-navy-800 border border-gov-navy-200 px-2 py-0.5 rounded">
                    {scheme.schemeCode}
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-700">
                    {t('landing.activeYear')}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-gov-navy-950 leading-snug">
                  {scheme.schemeName}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-3">
                  {scheme.description}
                </p>

                <div className="pt-2 border-t border-slate-100 space-y-1 text-xs text-slate-700">
                  <div>
                    <span className="font-semibold text-slate-900">{t('landing.incomeLimit')}</span>{' '}
                    {t('landing.upToPerYear', { amount: `₹${scheme.incomeLimit?.toLocaleString('en-IN')}` })}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900">{t('landing.levelsLabel')}</span>{' '}
                    {scheme.educationLevels?.join(', ')}
                  </div>
                  <div className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded border border-amber-200 mt-2">
                    {scheme.financialBenefits?.benefitSummary || t('landing.benefitSummaryFallback')}
                  </div>
                </div>
              </div>

              <div className="pt-5 border-t border-slate-100 mt-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Link
                    to="/schemes"
                    className="text-xs font-semibold text-slate-600 hover:text-slate-900"
                  >
                    {t('landing.viewCriteria')}
                  </Link>
                  <a
                    href={scheme.officialUrl || 'https://tribal.nic.in/ScholarshiP.aspx'}
                    target="_blank"
                    rel="noreferrer"
                    title={scheme.officialSource || 'MoTA official guidelines'}
                    className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    {t('landing.officialSource')}
                  </a>
                </div>
                <Link
                  to="/applicant/application/new"
                  state={{ schemeId: scheme._id }}
                  className="bg-gov-navy-900 hover:bg-gov-navy-800 text-white font-semibold text-xs px-3.5 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                >
                  {t('landing.apply')} <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. How It Works: 6-Stage Transparent Digital Journey */}
      <section className="py-16 bg-gov-navy-950 text-white px-4 sm:px-6 lg:px-8 border-t border-b border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-400">
              {t('landing.architectureEyebrow')}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold">
              {t('landing.workflowTitle')}
            </h2>
            <p className="text-xs text-slate-400">
              {t('landing.workflowDesc')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            {[
              {
                step: '01',
                title: t('landing.step1Title'),
                desc: t('landing.step1Desc'),
                icon: Search,
              },
              {
                step: '02',
                title: t('landing.step2Title'),
                desc: t('landing.step2Desc'),
                icon: FileText,
              },
              {
                step: '03',
                title: t('landing.step3Title'),
                desc: t('landing.step3Desc'),
                icon: Cpu,
              },
              {
                step: '04',
                title: t('landing.step4Title'),
                desc: t('landing.step4Desc'),
                icon: Eye,
              },
              {
                step: '05',
                title: t('landing.step5Title'),
                desc: t('landing.step5Desc'),
                icon: Award,
              },
              {
                step: '06',
                title: t('landing.step6Title'),
                desc: t('landing.step6Desc'),
                icon: CreditCard,
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/50 transition-colors space-y-3"
              >
                <div className="flex items-center justify-between">
                  <item.icon className="w-5 h-5 text-amber-400" />
                  <span className="text-xs font-mono font-bold text-slate-500">{item.step}</span>
                </div>
                <h4 className="font-bold text-xs text-white leading-snug">{item.title}</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Core AI Principles: Explainable AI & Human Oversight */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-amber-50 via-white to-emerald-50 rounded-2xl border border-amber-200/70 p-8 sm:p-12 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 text-xs font-bold px-2.5 py-1 rounded-md border border-amber-300">
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                {t('landing.aiFrameworkBadge')}
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
                {t('landing.aiHeadline')}
              </h2>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {t('landing.aiParagraph')}
              </p>

              <div className="space-y-2.5 text-xs text-slate-800">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>{t('landing.point1Label')}</strong> {t('landing.point1Text')}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>{t('landing.point2Label')}</strong> {t('landing.point2Text')}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>{t('landing.point3Label')}</strong> {t('landing.point3Text')}
                  </span>
                </div>
              </div>
            </div>

            {/* Synthetic Explainability Preview Card */}
            <div className="bg-white rounded-xl border border-slate-300 p-5 shadow-md space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                  <span className="font-bold text-xs text-slate-900">
                    {t('landing.evidenceCardTitle')}
                  </span>
                </div>
                <span className="text-[10px] font-mono font-semibold bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                  {t('landing.attentionRequired')}
                </span>
              </div>

              <div className="bg-amber-50/80 border border-amber-200 rounded-lg p-3 space-y-1.5 text-xs">
                <div className="font-bold text-amber-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  {t('landing.discrepancyTitle')}
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                  <div>
                    <span className="text-slate-500">{t('landing.applicantFormValue')}</span>
                    <div className="font-bold text-slate-800">₹4,50,000 / annum</div>
                  </div>
                  <div>
                    <span className="text-slate-500">{t('landing.ocrExtractedFigure')}</span>
                    <div className="font-bold text-red-700">₹7,20,000 / annum</div>
                  </div>
                </div>
                <div className="text-[10px] text-slate-500 pt-1 border-t border-amber-200">
                  {t('landing.algorithmConfidence')}
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-500 font-medium">
                  {t('landing.officerAction')}
                </span>
                <Link
                  to="/demo"
                  className="text-xs font-bold text-gov-navy-900 hover:text-amber-700 flex items-center gap-1"
                >
                  {t('landing.testInDemoHub')} <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ Section */}
      <section className="py-16 bg-slate-100 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-10 space-y-1">
          <h2 className="text-2xl font-bold text-slate-900">{t('landing.faqTitle')}</h2>
          <p className="text-xs text-slate-600">
            {t('landing.faqSubtitle')}
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full text-left p-4 flex items-center justify-between font-semibold text-xs sm:text-sm text-slate-900 hover:bg-slate-50 transition-colors"
              >
                <span>{faq.q}</span>
                <span className="text-slate-400 font-bold text-lg">
                  {activeFaq === idx ? '−' : '+'}
                </span>
              </button>
              {activeFaq === idx && (
                <div className="px-4 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
