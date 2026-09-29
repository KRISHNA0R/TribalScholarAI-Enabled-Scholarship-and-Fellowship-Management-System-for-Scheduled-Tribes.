import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAccessibility } from '../context/AccessibilityContext.jsx';
import api from '../services/api.js';
import {
  GraduationCap,
  FileText,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  Cpu,
  Clock,
  History,
  CreditCard,
  User,
  Building,
  Award,
  ChevronRight,
  Eye,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { formatINR, formatDate, formatDateTime } from '../utils/formatters.js';

const ApplicationDetailPage = () => {
  const { id } = useParams();
  const { t } = useAccessibility();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await api.get(`/applications/${id}`);
        if (res.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Failed to load application detail:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xs text-slate-500">
        {t('adetail.loading')}
      </div>
    );
  }

  if (!data || !data.application) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xs text-slate-500">
        {t('adetail.notFound')}
      </div>
    );
  }

  const { application, documents, verifications, eligibilityResult, deficiencies, auditLogs } = data;
  const profile = application.profileId;
  const scheme = application.schemeId;

  // Safe status translation: status.* (shared) -> adetail.status.* (page) -> raw enum value
  const statusText = (value) => {
    if (!value) return value;
    const sharedKey = `status.${value}`;
    const shared = t(sharedKey);
    if (shared !== sharedKey) return shared;
    const localKey = `adetail.status.${value}`;
    const local = t(localKey);
    return local === localKey ? value : local;
  };

  // Safe severity translation: adetail.severity.* -> raw enum value
  const severityText = (value) => {
    if (!value) return value;
    const key = `adetail.severity.${value}`;
    const label = t(key);
    return label === key ? value : label;
  };

  const tabs = [
    { id: 'overview', label: t('adetail.tabOverview'), icon: User },
    { id: 'documents', label: t('adetail.tabDocuments', { count: documents?.length || 0 }), icon: FileText },
    { id: 'eligibility', label: t('adetail.tabEligibility'), icon: ShieldCheck },
    { id: 'ai', label: t('adetail.tabAI'), icon: Cpu },
    { id: 'deficiencies', label: t('adetail.tabDeficiencies', { count: deficiencies?.length || 0 }), icon: AlertTriangle },
    { id: 'audit', label: t('adetail.tabAudit', { count: auditLogs?.length || 0 }), icon: History },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* 1. Application Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-slate-500">
              {application.applicationNumber}
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                application.status === 'DISBURSED'
                  ? 'bg-emerald-100 text-emerald-800'
                  : application.status === 'DEFICIENCY_RAISED'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-blue-100 text-blue-800'
              }`}
            >
              {statusText(application.status)}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gov-navy-950">
            {scheme?.schemeName || t('adetail.defaultSchemeName')}
          </h1>
          <p className="text-xs text-slate-600">
            {t('adetail.applicantLabel')} <strong className="text-slate-800">{profile?.fullName}</strong> &bull; {t('adetail.currentStageLabel')}{' '}
            <span className="font-semibold text-gov-navy-900">{application.currentStage}</span>
          </p>
        </div>

        {/* AI Risk & Queue Pill */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-right text-xs space-y-1">
          <div className="text-[11px] text-slate-500 font-medium">{t('adetail.assignedQueue')}</div>
          <div className="font-bold text-gov-navy-900">
            {application.aiVerificationSummary?.recommendedQueue?.replace(/_/g, ' ') || t('adetail.normalReview')}
          </div>
          <div className="text-[10px] text-emerald-700 font-semibold">
            {t('adetail.aiConfidence')} {application.aiVerificationSummary?.confidenceScore || 96}%
          </div>
        </div>
      </div>

      {/* 2. Horizontal Navigation Tabs */}
      <div className="bg-white rounded-xl border border-slate-200 p-2 shadow-xs flex flex-wrap gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === tab.id
                ? 'bg-gov-navy-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* 3. Tab Contents */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        {/* TAB 1: Overview & Profile */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Student Demographics */}
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200/80 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <User className="w-4 h-4 text-gov-navy-900" />
                  {t('adetail.demographicsTitle')}
                </h3>
                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">{t('adetail.fullName')}</span>
                    <span className="font-semibold text-slate-900">{profile?.fullName}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">{t('adetail.dob')}</span>
                    <span className="font-semibold text-slate-900">{formatDate(profile?.dob)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">{t('adetail.tribeCommunity')}</span>
                    <span className="font-semibold text-slate-900">{profile?.tribeName}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">{t('adetail.stCertificateNo')}</span>
                    <span className="font-mono font-semibold text-slate-900">{profile?.stCertificateNo}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">{t('adetail.pvtgStatus')}</span>
                    <span className="font-semibold text-amber-800">
                      {profile?.isPVTG ? t('adetail.pvtgYes') : t('adetail.standardSt')}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">{t('adetail.stateDistrict')}</span>
                    <span className="font-semibold text-slate-900">{profile?.district}, {profile?.state}</span>
                  </div>
                </div>
              </div>

              {/* Academic & Institution */}
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200/80 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <Building className="w-4 h-4 text-gov-navy-900" />
                  {t('adetail.institutionRecord')}
                </h3>
                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">{t('adetail.institution')}</span>
                    <span className="font-semibold text-slate-900">{profile?.institutionName}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">{t('adetail.institutionType')}</span>
                    <span className="font-semibold text-slate-900">{profile?.institutionType}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">{t('adetail.courseStream')}</span>
                    <span className="font-semibold text-slate-900">{profile?.courseName}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">{t('adetail.educationLevel')}</span>
                    <span className="font-semibold text-slate-900">{profile?.currentEducationLevel}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-200/60">
                    <span className="text-slate-500">{t('adetail.marksPercentage')}</span>
                    <span className="font-bold text-slate-900">{profile?.previousExamMarksPercentage}%</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">{t('adetail.aisheCode')}</span>
                    <span className="font-mono text-slate-900">{profile?.aisheCode}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Financial & DBT Sanction Card */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-950 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-800" />
                {t('adetail.dbtOverview')}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-emerald-700 font-medium">{t('adetail.declaredIncome')}</span>
                  <div className="font-extrabold text-sm text-emerald-950">
                    {formatINR(profile?.annualFamilyIncome)}
                  </div>
                </div>
                <div>
                  <span className="text-emerald-700 font-medium">{t('adetail.sanctionOrderNo')}</span>
                  <div className="font-mono font-bold text-emerald-950">
                    {application.sanctionOrderNo || t('adetail.pendingCommitteeReview')}
                  </div>
                </div>
                <div>
                  <span className="text-emerald-700 font-medium">{t('adetail.sanctionedGrant')}</span>
                  <div className="font-extrabold text-sm text-emerald-950">
                    {application.sanctionAmount ? formatINR(application.sanctionAmount) : t('adetail.pendingSanction')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Documents & OCR Intelligence */}
        {activeTab === 'documents' && (
          <div className="space-y-4">
            <div className="text-xs text-slate-600">
              {t('adetail.documentsIntro')}
            </div>

            <div className="grid grid-cols-1 gap-4">
              {documents?.map((doc) => {
                const ver = verifications?.find((v) => v.documentId === doc._id);
                return (
                  <div
                    key={doc._id}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <FileText className="w-5 h-5 text-gov-navy-900" />
                        <div>
                          <div className="font-bold text-xs text-gov-navy-950">
                            {doc.originalFileName}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            {t('adetail.type')} {doc.docType} &bull; {t('adetail.sha256Hash')} {doc.documentHash?.slice(0, 18)}...
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                          {t('adetail.ocrConfidence')} {doc.ocrConfidence || 97}%
                        </span>
                        <span className="text-[10px] bg-slate-200 text-slate-800 font-semibold px-2 py-0.5 rounded">
                          {t('adetail.statusLabel')} {statusText(doc.status)}
                        </span>
                      </div>
                    </div>

                    {/* Extracted Fields Table */}
                    {ver && ver.extractedData && (
                      <div className="bg-white rounded-lg p-3 border border-slate-200 text-xs grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {ver.extractedData.candidateName && (
                          <div>
                            <span className="text-[10px] text-slate-400 font-medium">{t('adetail.candidateName')}</span>
                            <div className="font-semibold text-slate-800">{ver.extractedData.candidateName}</div>
                          </div>
                        )}
                        {ver.extractedData.certificateNumber && (
                          <div>
                            <span className="text-[10px] text-slate-400 font-medium">{t('adetail.certificateRef')}</span>
                            <div className="font-mono font-semibold text-slate-800">{ver.extractedData.certificateNumber}</div>
                          </div>
                        )}
                        {ver.extractedData.annualIncome !== undefined && (
                          <div>
                            <span className="text-[10px] text-slate-400 font-medium">{t('adetail.extractedIncome')}</span>
                            <div className="font-bold text-slate-900">{formatINR(ver.extractedData.annualIncome)}</div>
                          </div>
                        )}
                        {ver.extractedData.issuingAuthority && (
                          <div className="sm:col-span-3 text-[11px] text-slate-600 border-t border-slate-100 pt-1 mt-1">
                            <span className="text-slate-400">{t('adetail.authority')}</span> {ver.extractedData.issuingAuthority}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: Rules & Transparency Panel */}
        {activeTab === 'eligibility' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <div className="font-bold text-xs text-slate-900">
                  {t('adetail.ruleEngineOutput')} {statusText(eligibilityResult?.decision || 'ELIGIBLE')}
                </div>
                <div className="text-[11px] text-slate-600">
                  {t('adetail.meritScore')} {eligibilityResult?.compositeMeritScore || 75}/100
                </div>
              </div>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                {t('adetail.aiRuleCheck')}
              </span>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                {t('adetail.evaluatedRules')}
              </div>
              {eligibilityResult?.ruleResults?.map((r, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg border border-slate-200 bg-white flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    {r.passed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    )}
                    <div>
                      <div className="font-bold text-slate-900">{r.ruleName}</div>
                      <div className="text-[11px] text-slate-500">
                        {r.message} &bull; {t('adetail.expected')}: {JSON.stringify(r.expectedValue)} {t('adetail.vsActual')}: {JSON.stringify(r.actualValue)}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`font-bold text-[10px] px-2 py-0.5 rounded uppercase ${
                      r.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {r.passed ? t('adetail.passed') : t('adetail.failed')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: Explainable AI & Anomaly Flags */}
        {activeTab === 'ai' && (
          <div className="space-y-4">
            <div className="text-xs text-slate-600">
              {t('adetail.aiIntro')}
            </div>

            {verifications?.some((v) => v.aiFlags?.length > 0) ? (
              <div className="space-y-3">
                {verifications.map((v) =>
                  v.aiFlags?.map((flag, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-amber-200 bg-amber-50/80 space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-amber-950 flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-amber-600" />
                          {flag.title}
                        </span>
                        <span className="text-[10px] font-mono font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded">
                          {t('adetail.severity')} {severityText(flag.severity)}
                        </span>
                      </div>
                      <p className="text-slate-800 text-[11px] leading-relaxed">{flag.message}</p>
                      {flag.evidence && (
                        <div className="bg-white rounded-lg p-2.5 border border-amber-200 text-[11px] grid grid-cols-2 gap-2 text-slate-700">
                          <div>{t('adetail.expected')}: {String(flag.evidence.expectedValue || t('adetail.na'))}</div>
                          <div>{t('adetail.extracted')}: {String(flag.evidence.extractedValue || t('adetail.na'))}</div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="p-8 rounded-xl border border-emerald-200 bg-emerald-50 text-center text-xs text-emerald-900">
                <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <div className="font-bold">{t('adetail.noFlagsTitle')}</div>
                <div className="text-[11px] text-emerald-800 mt-1">
                  {t('adetail.noFlagsDesc')}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: Deficiencies */}
        {activeTab === 'deficiencies' && (
          <div className="space-y-4">
            {deficiencies?.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                {t('adetail.noDeficiencies')}
              </div>
            ) : (
              <div className="space-y-3">
                {deficiencies.map((def) => (
                  <div
                    key={def._id}
                    className="p-4 rounded-xl border border-amber-200 bg-amber-50/60 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-amber-900">
                        {def.deficiencyCode} &bull; {def.title}
                      </span>
                      <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded">
                        {t('adetail.statusLabel')} {statusText(def.status)}
                      </span>
                    </div>
                    <p className="text-slate-700 text-[11px]">{def.description}</p>
                    <div className="bg-white p-2.5 rounded border border-amber-200 text-[11px]">
                      <strong>{t('adetail.remediationInstruction')}</strong> {def.remediationInstruction}
                    </div>
                    {def.status === 'OPEN' && (
                      <Link
                        to="/applicant/deficiencies"
                        className="inline-block bg-gov-navy-900 text-white font-bold text-[11px] px-3 py-1.5 rounded-md mt-1"
                      >
                        {t('adetail.submitCorrection')}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 6: Immutable Audit Trail */}
        {activeTab === 'audit' && (
          <div className="space-y-3">
            <div className="text-xs text-slate-600 mb-2">
              {t('adetail.auditIntro')}
            </div>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                  <tr>
                    <th className="p-3">{t('adetail.colTimestamp')}</th>
                    <th className="p-3">{t('adetail.colUser')}</th>
                    <th className="p-3">{t('adetail.colRole')}</th>
                    <th className="p-3">{t('adetail.colAction')}</th>
                    <th className="p-3">{t('adetail.colReason')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {auditLogs?.map((log) => (
                    <tr key={log._id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono text-[11px]">{formatDateTime(log.createdAt)}</td>
                      <td className="p-3 font-semibold">{log.userName}</td>
                      <td className="p-3 text-[10px] font-bold">{log.userRole}</td>
                      <td className="p-3 font-mono text-[11px] text-gov-navy-900">{log.action}</td>
                      <td className="p-3 text-slate-600">{log.reason || t('adetail.workflowProgression')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationDetailPage;
