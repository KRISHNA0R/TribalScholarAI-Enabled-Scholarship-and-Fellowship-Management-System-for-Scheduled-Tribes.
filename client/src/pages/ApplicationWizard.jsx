import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useNotification } from '../context/NotificationContext.jsx';
import { useAccessibility } from '../context/AccessibilityContext.jsx';
import api from '../services/api.js';
import {
  GraduationCap,
  ArrowRight,
  ArrowLeft,
  Save,
  CheckCircle,
  AlertTriangle,
  Upload,
  Cpu,
  ShieldCheck,
  FileText,
  User,
  Building,
  CreditCard,
  CheckSquare,
} from 'lucide-react';
import { formatINR } from '../utils/formatters.js';

const ApplicationWizard = () => {
  const { user, profile } = useAuth();
  const { addToast } = useNotification();
  const { t } = useAccessibility();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [currentStep, setCurrentStep] = useState(1);
  const [schemes, setSchemes] = useState([]);
  const [selectedSchemeId, setSelectedSchemeId] = useState(
    location.state?.schemeId || searchParams.get('schemeId') || ''
  );
  const [applicationId, setApplicationId] = useState(searchParams.get('draftId') || null);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [aiPreviewData, setAiPreviewData] = useState(null);

  // Form State across all 10 steps
  const [formData, setFormData] = useState({
    // 1. Personal
    fullName: user?.name || '',
    dob: profile?.dob ? new Date(profile.dob).toISOString().split('T')[0] : '2004-06-15',
    gender: profile?.gender || 'Male',
    fatherName: profile?.fatherName || 'Late/Shri Father',
    motherName: profile?.motherName || 'Smt. Mother',
    addressLine: profile?.addressLine || 'Tribal Welfare Area, Main Road',
    state: profile?.state || 'Jharkhand',
    district: profile?.district || 'Ranchi',
    pincode: profile?.pincode || '834001',

    // 2. Category & Social
    category: 'ST',
    tribeName: profile?.tribeName || 'Santhal',
    subTribe: profile?.subTribe || '',
    isPVTG: profile?.isPVTG || false,
    stCertificateNo: profile?.stCertificateNo || `ST/JH/2023/${Math.floor(100000 + Math.random() * 900000)}`,
    stIssuingAuthority: 'Sub-Divisional Officer (SDO) / Tehsildar',

    // 3. Academic
    currentEducationLevel: profile?.currentEducationLevel || 'Undergraduate',
    courseName: profile?.courseName || 'Bachelor of Technology (Computer Science)',
    currentYear: profile?.currentYear || 1,
    previousExamMarksPercentage: profile?.previousExamMarksPercentage || 76.5,
    rollNumber: profile?.rollNumber || 'ST-2025-0982',

    // 4. Institution
    institutionName: profile?.institutionName || 'National Institute of Technology (NIT) Jamshedpur',
    institutionType: profile?.institutionType || 'Premier Institute (IIT/NIT/IIM/AIIMS)',
    aisheCode: profile?.aisheCode || 'U-0245',
    isHosteller: profile?.isHosteller || true,

    // 5. Family & Income
    annualFamilyIncome: profile?.annualFamilyIncome || 180000,
    incomeCertificateNo: profile?.incomeCertificateNo || `INC/2024/${Math.floor(10000 + Math.random() * 90000)}`,
    fatherOccupation: profile?.fatherOccupation || 'Agriculture',

    // 6. Bank / DBT
    accountHolderName: user?.name || 'Rahul Kumar',
    bankName: profile?.bankName || 'State Bank of India',
    ifscCode: profile?.ifscCode || 'SBIN0001234',
    accountNumberMasked: profile?.accountNumberMasked || 'XXXX XXXX 4821',

    // 7. Scheme-Specific
    researchTopic: profile?.researchTopic || 'Sustainable Tribal Forest Economies and Ethnobotanical Knowledge',
    guideName: profile?.guideName || 'Prof. S. K. Marandi',
    overseasUniversity: profile?.overseasUniversity || 'University of Oxford, UK',
    qsWorldRank: profile?.qsWorldRank || 15,

    // 8. Uploaded Document Placeholders
    documentsUploaded: {
      ST_CERTIFICATE: true,
      INCOME_CERTIFICATE: true,
      ACADEMIC_MARKSHEET: true,
      ADMISSION_BONAFIDE: true,
      BANK_PASSBOOK_CANCELLED_CHEQUE: true,
    },

    // 10. Declaration
    declarationConfirmed: false,
  });

  // Fetch schemes
  useEffect(() => {
    const init = async () => {
      try {
        const res = await api.get('/schemes');
        if (res.success && res.data) {
          setSchemes(res.data);
          if (!selectedSchemeId && res.data.length > 0) {
            setSelectedSchemeId(res.data[0]._id);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    init();
  }, []);

  // Ensure application draft exists in DB
  useEffect(() => {
    const ensureDraft = async () => {
      if (!selectedSchemeId || applicationId) return;
      try {
        const res = await api.post('/applications', {
          schemeId: selectedSchemeId,
          profileData: formData,
        });
        if (res.success && res.data) {
          setApplicationId(res.data._id);
          if (res.data.wizardStepCompleted) {
            setCurrentStep(Math.min(res.data.wizardStepCompleted, 10));
          }
        }
      } catch (err) {
        console.error('Draft init error:', err);
      }
    };
    ensureDraft();
  }, [selectedSchemeId]);

  // Autosave draft when moving between steps
  const saveDraft = async (nextStep = currentStep) => {
    if (!applicationId) return;
    setSaving(true);
    try {
      await api.put(`/applications/${applicationId}/draft`, {
        step: nextStep,
        formData,
        profileUpdates: {
          fullName: formData.fullName,
          tribeName: formData.tribeName,
          isPVTG: formData.isPVTG,
          annualFamilyIncome: Number(formData.annualFamilyIncome),
          currentEducationLevel: formData.currentEducationLevel,
          previousExamMarksPercentage: Number(formData.previousExamMarksPercentage),
          institutionName: formData.institutionName,
          institutionType: formData.institutionType,
        },
      });
    } catch (err) {
      console.error('Autosave error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleNext = async () => {
    // If moving to step 9 (AI Verification Preview), fetch preview analysis
    if (currentStep === 8) {
      await loadAiPreview();
    }
    const next = Math.min(10, currentStep + 1);
    setCurrentStep(next);
    await saveDraft(next);
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const loadAiPreview = async () => {
    try {
      const res = await api.post('/ai/eligibility', {
        schemeId: selectedSchemeId,
        applicantProfile: {
          ...formData,
          annualFamilyIncome: Number(formData.annualFamilyIncome),
          previousExamMarksPercentage: Number(formData.previousExamMarksPercentage),
        },
      });
      if (res.success) {
        setAiPreviewData(res.data);
      }
    } catch (err) {
      console.error('AI preview evaluation failed:', err);
    }
  };

  const handleSubmitApplication = async () => {
    if (!formData.declarationConfirmed) {
      addToast({
        title: t('wizard.declarationRequiredTitle'),
        message: t('wizard.declarationRequiredMsg'),
        type: 'warning',
      });
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post(`/applications/${applicationId}/submit`);
      if (res.success) {
        addToast({
          title: t('wizard.submitSuccessTitle'),
          message: t('wizard.submitSuccessMsg'),
          type: 'success',
        });
        navigate(`/applicant/application/${applicationId}`);
      }
    } catch (err) {
      addToast({
        title: t('wizard.submitFailedTitle'),
        message: err.userMessage || t('wizard.submitFailedMsg'),
        type: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const currentScheme = schemes.find((s) => s._id === selectedSchemeId) || schemes[0];

  // Safe status translation: shared status.* -> wizard.status.* -> raw enum value
  const statusText = (value) => {
    if (!value) return value;
    const sharedKey = `status.${value}`;
    const shared = t(sharedKey);
    if (shared !== sharedKey) return shared;
    const localKey = `wizard.status.${value}`;
    const local = t(localKey);
    return local === localKey ? value : local;
  };

  const stepsList = [
    { num: 1, label: t('wizard.step1') },
    { num: 2, label: t('wizard.step2') },
    { num: 3, label: t('wizard.step3') },
    { num: 4, label: t('wizard.step4') },
    { num: 5, label: t('wizard.step5') },
    { num: 6, label: t('wizard.step6') },
    { num: 7, label: t('wizard.step7') },
    { num: 8, label: t('wizard.step8') },
    { num: 9, label: t('wizard.step9') },
    { num: 10, label: t('wizard.step10') },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-6">
      {/* Wizard Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 rounded">
              {t('wizard.badgeOfficial')}
            </span>
            {saving && (
              <span className="text-[11px] text-slate-500 flex items-center gap-1 animate-pulse">
                <Save className="w-3 h-3" /> {t('wizard.draftAutosaved')}
              </span>
            )}
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gov-navy-950 mt-1">
            {t('wizard.applicationFor', { scheme: currentScheme?.shortTitle || t('wizard.defaultSchemeTitle') })}
          </h1>
          <p className="text-xs text-slate-600">
            {t('wizard.academicSession')}
          </p>
        </div>

        {/* Scheme Selector */}
        <div className="w-full md:w-64">
          <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
            {t('wizard.selectedScheme')}
          </label>
          <select
            value={selectedSchemeId}
            onChange={(e) => setSelectedSchemeId(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-gov-navy-900 focus:outline-none font-medium"
          >
            {schemes.map((s) => (
              <option key={s._id} value={s._id}>
                {s.shortTitle}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 10-Step Horizontal Stepper */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs overflow-x-auto">
        <div className="flex items-center justify-between min-w-[700px] gap-2">
          {stepsList.map((st) => (
            <div
              key={st.num}
              onClick={() => {
                if (st.num <= currentStep) setCurrentStep(st.num);
              }}
              className={`flex items-center gap-2 cursor-pointer transition-colors ${
                st.num === currentStep
                  ? 'text-gov-navy-900 font-bold'
                  : st.num < currentStep
                  ? 'text-emerald-700 font-medium'
                  : 'text-slate-400'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  st.num === currentStep
                    ? 'bg-gov-navy-900 text-white shadow-xs'
                    : st.num < currentStep
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {st.num < currentStep ? <CheckCircle className="w-4 h-4" /> : st.num}
              </div>
              <span className="text-[11px] whitespace-nowrap">{st.label}</span>
              {st.num < 10 && <div className="w-4 h-0.5 bg-slate-200"></div>}
            </div>
          ))}
        </div>
      </div>

      {/* Main Wizard Step Content Form */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        {/* STEP 1: Personal Details */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-in fade-in">
            <h3 className="font-bold text-sm text-gov-navy-950 pb-2 border-b border-slate-100 flex items-center gap-2">
              <User className="w-4 h-4 text-gov-navy-900" />
              {t('wizard.step1Title')}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t('wizard.fullName')}</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t('wizard.dob')}</label>
                <input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t('wizard.gender')}</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                >
                  <option value="Male">{t('wizard.male')}</option>
                  <option value="Female">{t('wizard.female')}</option>
                  <option value="Transgender">{t('wizard.transgender')}</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t('wizard.fatherName')}</label>
                <input
                  type="text"
                  value={formData.fatherName}
                  onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t('wizard.motherName')}</label>
                <input
                  type="text"
                  value={formData.motherName}
                  onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t('wizard.pincode')}</label>
                <input
                  type="text"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">{t('wizard.address')}</label>
                <input
                  type="text"
                  value={formData.addressLine}
                  onChange={(e) => setFormData({ ...formData, addressLine: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Category & Social Details */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-in fade-in">
            <h3 className="font-bold text-sm text-gov-navy-950 pb-2 border-b border-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-gov-navy-900" />
              {t('wizard.step2Title')}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t('wizard.category')}</label>
                <input
                  type="text"
                  disabled
                  value={t('wizard.categoryValue')}
                  className="w-full p-2 bg-slate-100 border border-slate-300 rounded-lg text-slate-700 font-bold"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t('wizard.tribeCommunity')}</label>
                <input
                  type="text"
                  value={formData.tribeName}
                  onChange={(e) => setFormData({ ...formData, tribeName: e.target.value })}
                  placeholder={t('wizard.tribePlaceholder')}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t('wizard.subTribe')}</label>
                <input
                  type="text"
                  value={formData.subTribe}
                  onChange={(e) => setFormData({ ...formData, subTribe: e.target.value })}
                  placeholder={t('wizard.subTribePlaceholder')}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t('wizard.stCertificateNo')}</label>
                <input
                  type="text"
                  value={formData.stCertificateNo}
                  onChange={(e) => setFormData({ ...formData, stCertificateNo: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono font-medium"
                />
              </div>

              <div className="sm:col-span-2 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <div className="font-bold text-amber-950 text-xs">
                    {t('wizard.pvtgTitle')}
                  </div>
                  <p className="text-[11px] text-amber-800">
                    {t('wizard.pvtgDesc')}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPVTG}
                    onChange={(e) => setFormData({ ...formData, isPVTG: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Academic Details */}
        {currentStep === 3 && (
          <div className="space-y-4 animate-in fade-in">
            <h3 className="font-bold text-sm text-gov-navy-950 pb-2 border-b border-slate-100 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-gov-navy-900" />
              {t('wizard.step3Title')}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t('wizard.educationLevel')}</label>
                <select
                  value={formData.currentEducationLevel}
                  onChange={(e) => setFormData({ ...formData, currentEducationLevel: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                >
                  <option value="Class 10">{t('wizard.levelClass10')}</option>
                  <option value="Class 12">{t('wizard.levelClass12')}</option>
                  <option value="Undergraduate">{t('wizard.levelUG')}</option>
                  <option value="Postgraduate">{t('wizard.levelPG')}</option>
                  <option value="Ph.D">{t('wizard.levelPhD')}</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t('wizard.courseName')}</label>
                <input
                  type="text"
                  value={formData.courseName}
                  onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {t('wizard.marksPercentage')}
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="35"
                  max="100"
                  value={formData.previousExamMarksPercentage}
                  onChange={(e) =>
                    setFormData({ ...formData, previousExamMarksPercentage: e.target.value })
                  }
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-bold"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t('wizard.rollNumber')}</label>
                <input
                  type="text"
                  value={formData.rollNumber}
                  onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Institution Details */}
        {currentStep === 4 && (
          <div className="space-y-4 animate-in fade-in">
            <h3 className="font-bold text-sm text-gov-navy-950 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Building className="w-4 h-4 text-gov-navy-900" />
              {t('wizard.step4Title')}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">{t('wizard.institutionName')}</label>
                <input
                  type="text"
                  value={formData.institutionName}
                  onChange={(e) => setFormData({ ...formData, institutionName: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-medium"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t('wizard.institutionType')}</label>
                <select
                  value={formData.institutionType}
                  onChange={(e) => setFormData({ ...formData, institutionType: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                >
                  <option value="Premier Institute (IIT/NIT/IIM/AIIMS)">{t('wizard.instPremier')}</option>
                  <option value="Central University">{t('wizard.instCentralUniversity')}</option>
                  <option value="State University">{t('wizard.instStateUniversity')}</option>
                  <option value="Govt College">{t('wizard.instGovtCollege')}</option>
                  <option value="Govt School">{t('wizard.instGovtSchool')}</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t('wizard.aisheCode')}</label>
                <input
                  type="text"
                  value={formData.aisheCode}
                  onChange={(e) => setFormData({ ...formData, aisheCode: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Family & Income Details */}
        {currentStep === 5 && (
          <div className="space-y-4 animate-in fade-in">
            <h3 className="font-bold text-sm text-gov-navy-950 pb-2 border-b border-slate-100 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-gov-navy-900" />
              {t('wizard.step5Title')}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {t('wizard.annualIncome')}
                </label>
                <input
                  type="number"
                  value={formData.annualFamilyIncome}
                  onChange={(e) => setFormData({ ...formData, annualFamilyIncome: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-900 text-sm"
                />
                <span className="text-[10px] text-slate-500">
                  {t('wizard.schemeCeiling', { amount: formatINR(currentScheme?.incomeLimit) })}
                </span>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {t('wizard.incomeCertificateNo')}
                </label>
                <input
                  type="text"
                  value={formData.incomeCertificateNo}
                  onChange={(e) => setFormData({ ...formData, incomeCertificateNo: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t('wizard.fatherOccupation')}</label>
                <input
                  type="text"
                  value={formData.fatherOccupation}
                  onChange={(e) => setFormData({ ...formData, fatherOccupation: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: Bank & DBT Details */}
        {currentStep === 6 && (
          <div className="space-y-4 animate-in fade-in">
            <h3 className="font-bold text-sm text-gov-navy-950 pb-2 border-b border-slate-100 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-gov-navy-900" />
              {t('wizard.step6Title')}
            </h3>
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-2 text-xs">
              <div className="font-bold text-emerald-950 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-700" />
                {t('wizard.apbsActive')}
              </div>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                {t('wizard.apbsDesc')}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t('wizard.accountHolderName')}</label>
                <input
                  type="text"
                  value={formData.accountHolderName}
                  onChange={(e) => setFormData({ ...formData, accountHolderName: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t('wizard.bankName')}</label>
                <input
                  type="text"
                  value={formData.bankName}
                  onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t('wizard.ifscCode')}</label>
                <input
                  type="text"
                  value={formData.ifscCode}
                  onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t('wizard.maskedAccount')}</label>
                <input
                  type="text"
                  disabled
                  value={formData.accountNumberMasked}
                  className="w-full p-2 bg-slate-100 border border-slate-300 rounded-lg font-mono text-slate-600"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 7: Scheme-Specific Questions */}
        {currentStep === 7 && (
          <div className="space-y-4 animate-in fade-in">
            <h3 className="font-bold text-sm text-gov-navy-950 pb-2 border-b border-slate-100 flex items-center gap-2">
              <FileText className="w-4 h-4 text-gov-navy-900" />
              {t('wizard.step7Title', { scheme: currentScheme?.shortTitle || '' })}
            </h3>
            {currentScheme?.schemeCode === 'NFST_FELLOWSHIP' ? (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {t('wizard.researchProposalTitle')}
                  </label>
                  <input
                    type="text"
                    value={formData.researchTopic}
                    onChange={(e) => setFormData({ ...formData, researchTopic: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-medium"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{t('wizard.researchGuide')}</label>
                  <input
                    type="text"
                    value={formData.guideName}
                    onChange={(e) => setFormData({ ...formData, guideName: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>
            ) : currentScheme?.schemeCode === 'NOS_OVERSEAS' ? (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {t('wizard.foreignUniversity')}
                  </label>
                  <input
                    type="text"
                    value={formData.overseasUniversity}
                    onChange={(e) => setFormData({ ...formData, overseasUniversity: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-medium"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {t('wizard.qsRanking')}
                  </label>
                  <input
                    type="number"
                    value={formData.qsWorldRank}
                    onChange={(e) => setFormData({ ...formData, qsWorldRank: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-bold"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <p className="text-slate-600">
                  {t('wizard.standardCriteria')}
                </p>
                <div className="flex gap-4 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="hostel"
                      checked={formData.isHosteller}
                      onChange={() => setFormData({ ...formData, isHosteller: true })}
                    />
                    <span>{t('wizard.hosteller')}</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="hostel"
                      checked={!formData.isHosteller}
                      onChange={() => setFormData({ ...formData, isHosteller: false })}
                    />
                    <span>{t('wizard.dayScholar')}</span>
                  </label>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 8: Document Upload & Simulated Scanner */}
        {currentStep === 8 && (
          <div className="space-y-4 animate-in fade-in">
            <h3 className="font-bold text-sm text-gov-navy-950 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Upload className="w-4 h-4 text-gov-navy-900" />
              {t('wizard.step8Title')}
            </h3>
            <p className="text-xs text-slate-600">
              {t('wizard.uploadIntro')}
            </p>

            <div className="space-y-3">
              {[
                { type: 'ST_CERTIFICATE', name: t('wizard.docST'), mandatory: true },
                { type: 'INCOME_CERTIFICATE', name: t('wizard.docIncome'), mandatory: true },
                { type: 'ACADEMIC_MARKSHEET', name: t('wizard.docMarksheet'), mandatory: true },
                { type: 'ADMISSION_BONAFIDE', name: t('wizard.docBonafide'), mandatory: true },
                { type: 'BANK_PASSBOOK_CANCELLED_CHEQUE', name: t('wizard.docPassbook'), mandatory: true },
              ].map((item) => (
                <div
                  key={item.type}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-gov-navy-900">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{item.name}</div>
                      <div className="text-[10px] text-slate-500">
                        {t('wizard.fileHint')}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> {t('wizard.readyForOcr')}
                    </span>
                    <button
                      type="button"
                      className="text-xs bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 px-2.5 py-1 rounded cursor-pointer transition-colors"
                    >
                      {t('wizard.reupload')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 9: AI Verification Preview */}
        {currentStep === 9 && (
          <div className="space-y-4 animate-in fade-in">
            <h3 className="font-bold text-sm text-gov-navy-950 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-amber-600" />
              {t('wizard.step9Title')}
            </h3>
            <p className="text-xs text-slate-600">
              {t('wizard.aiPreviewIntro')}
            </p>

            {aiPreviewData ? (
              <div className="space-y-4">
                <div
                  className={`p-4 rounded-xl border flex items-center justify-between ${
                    aiPreviewData.decision === 'ELIGIBLE'
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                      : 'bg-amber-50 border-amber-300 text-amber-950'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-6 h-6 text-emerald-700" />
                    <div>
                      <div className="font-bold text-sm">
                        {t('wizard.preScrutiny', { decision: statusText(aiPreviewData.decision) })}
                      </div>
                      <div className="text-xs opacity-90">
                        {t('wizard.meritScore', { score: aiPreviewData.compositeMeritScore })}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider px-2 py-1 rounded bg-white border border-slate-200 shadow-2xs">
                    {t('wizard.confidenceBadge')}
                  </span>
                </div>

                {/* Evaluated Rules Breakdown */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    {t('wizard.criteriaEvaluated')}
                  </div>
                  {aiPreviewData.ruleResults?.map((r, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        {r.passed ? (
                          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                        )}
                        <div>
                          <div className="font-bold text-slate-900">{r.ruleName}</div>
                          <div className="text-[11px] text-slate-500">{r.message}</div>
                        </div>
                      </div>
                      <span className="font-mono text-[11px] text-slate-700">
                        {r.passed ? t('wizard.passed') : t('wizard.flagged')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-slate-500">
                {t('wizard.evaluatingRules')}
              </div>
            )}
          </div>
        )}

        {/* STEP 10: Declaration & Final Submission */}
        {currentStep === 10 && (
          <div className="space-y-5 animate-in fade-in">
            <h3 className="font-bold text-sm text-gov-navy-950 pb-2 border-b border-slate-100 flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-gov-navy-900" />
              {t('wizard.step10Title')}
            </h3>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-700 space-y-2 leading-relaxed">
              <p>
                <strong>{t('wizard.undertakingLabel')}</strong> {t('wizard.undertakingText')}
              </p>
              <p>
                {t('wizard.undertakingWarning')}
              </p>
            </div>

            <label className="flex items-start gap-3 cursor-pointer p-2">
              <input
                type="checkbox"
                checked={formData.declarationConfirmed}
                onChange={(e) => setFormData({ ...formData, declarationConfirmed: e.target.checked })}
                className="mt-1 w-4 h-4 text-gov-navy-900 rounded focus:ring-amber-500"
              />
              <span className="text-xs font-semibold text-slate-800">
                {t('wizard.declarationCheckbox')}
              </span>
            </label>
          </div>
        )}

        {/* Step Navigation Controls */}
        <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentStep === 1}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              currentStep === 1
                ? 'opacity-40 cursor-not-allowed text-slate-400'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" /> {t('wizard.previousStep')}
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => saveDraft(currentStep)}
              disabled={saving}
              className="px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 flex items-center gap-1.5 transition-colors"
            >
              <Save className="w-3.5 h-3.5" /> {t('wizard.saveDraft')}
            </button>

            {currentStep < 10 ? (
              <button
                type="button"
                onClick={handleNext}
                className="bg-gov-navy-900 hover:bg-gov-navy-800 text-white font-bold text-xs px-5 py-2.5 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors"
              >
                {t('wizard.saveContinue')} <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmitApplication}
                disabled={submitting}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-6 py-2.5 rounded-lg flex items-center gap-1.5 shadow-md transition-colors"
              >
                {submitting ? t('wizard.submittingMinistry') : t('wizard.submitFinal')}
                <CheckCircle className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationWizard;
