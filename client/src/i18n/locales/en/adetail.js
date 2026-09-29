export default {
  // Loading / not found
  'adetail.loading': 'Loading complete application bundle & audit records...',
  'adetail.notFound': 'Application record not found.',

  // Tabs
  'adetail.tabOverview': 'Overview & Profile',
  'adetail.tabDocuments': 'Documents ({count})',
  'adetail.tabEligibility': 'Rules & Transparency',
  'adetail.tabAI': 'AI Scrutiny & Flags',
  'adetail.tabDeficiencies': 'Deficiencies ({count})',
  'adetail.tabAudit': 'Audit Trail ({count})',

  // Banner
  'adetail.defaultSchemeName': 'Scheduled Tribe Scholarship Scheme',
  'adetail.applicantLabel': 'Applicant:',
  'adetail.currentStageLabel': 'Current Stage:',
  'adetail.assignedQueue': 'Assigned Review Queue',
  'adetail.normalReview': 'NORMAL REVIEW',
  'adetail.aiConfidence': 'AI Confidence:',

  // Overview tab
  'adetail.demographicsTitle': 'Student Demographics & ST Verification',
  'adetail.fullName': 'Full Name:',
  'adetail.dob': 'Date of Birth:',
  'adetail.tribeCommunity': 'Tribe Community:',
  'adetail.stCertificateNo': 'ST Certificate No:',
  'adetail.pvtgStatus': 'PVTG Status:',
  'adetail.pvtgYes': 'Yes (Particularly Vulnerable Tribal Group)',
  'adetail.standardSt': 'Standard ST',
  'adetail.stateDistrict': 'State / District:',
  'adetail.institutionRecord': 'Institution & Course Record',
  'adetail.institution': 'Institution:',
  'adetail.institutionType': 'Institution Type:',
  'adetail.courseStream': 'Course / Stream:',
  'adetail.educationLevel': 'Education Level:',
  'adetail.marksPercentage': 'Marks Percentage:',
  'adetail.aisheCode': 'AISHE Code:',
  'adetail.dbtOverview': 'Direct Benefit Transfer (DBT) & Sanction Overview',
  'adetail.declaredIncome': 'Declared Annual Income:',
  'adetail.sanctionOrderNo': 'Sanction Order Number:',
  'adetail.pendingCommitteeReview': 'Pending Committee Review',
  'adetail.sanctionedGrant': 'Sanctioned Grant Value:',
  'adetail.pendingSanction': 'Pending Sanction',

  // Documents tab
  'adetail.documentsIntro':
    'Statutory documents uploaded by the applicant and processed via the MoTA AI OCR pipeline.',
  'adetail.type': 'Type:',
  'adetail.sha256Hash': 'SHA-256 Hash:',
  'adetail.ocrConfidence': 'OCR Confidence:',
  'adetail.statusLabel': 'Status:',
  'adetail.candidateName': 'Candidate Name:',
  'adetail.certificateRef': 'Certificate Ref:',
  'adetail.extractedIncome': 'Extracted Income:',
  'adetail.authority': 'Authority:',

  // Rules tab
  'adetail.ruleEngineOutput': 'Configurable Rule Engine Output:',
  'adetail.meritScore': 'Composite Merit Score:',
  'adetail.aiRuleCheck': 'AI Rule Check: Complete',
  'adetail.evaluatedRules': 'Evaluated Scheme Rules:',
  'adetail.expected': 'Expected',
  'adetail.vsActual': 'vs Actual',
  'adetail.passed': 'PASSED',
  'adetail.failed': 'FAILED',

  // AI flags tab
  'adetail.aiIntro': 'Explainable AI analysis identifying potential anomalies for human verification.',
  'adetail.severity': 'SEVERITY:',
  'adetail.extracted': 'Extracted',
  'adetail.na': 'N/A',
  'adetail.noFlagsTitle': 'No Anomaly or Discrepancy Flags Detected',
  'adetail.noFlagsDesc': 'Document hashes and extracted data fully conform to scheme criteria.',

  // Deficiencies tab
  'adetail.noDeficiencies': 'No deficiencies raised on this application.',
  'adetail.remediationInstruction': 'Remediation Instruction:',
  'adetail.submitCorrection': 'Submit Correction Now',

  // Audit tab
  'adetail.auditIntro':
    'Immutable event log tracking all system and officer actions for accountability.',
  'adetail.colTimestamp': 'Timestamp',
  'adetail.colUser': 'User / Officer',
  'adetail.colRole': 'Role',
  'adetail.colAction': 'Action',
  'adetail.colReason': 'Reason / Details',
  'adetail.workflowProgression': 'Workflow progression',

  // Severity levels
  'adetail.severity.LOW': 'LOW',
  'adetail.severity.MEDIUM': 'MEDIUM',
  'adetail.severity.HIGH': 'HIGH',
  'adetail.severity.CRITICAL': 'CRITICAL',

  // Status values missing from the shared status.* namespace
  'adetail.status.UNDER_VERIFICATION': 'Under Verification',
  'adetail.status.CORRECTION_SUBMITTED': 'Correction Submitted',
  'adetail.status.SCRUTINY_PENDING': 'Scrutiny Pending',
  'adetail.status.SELECTION_REVIEW': 'Selection Review',
  'adetail.status.SHORTLISTED': 'Shortlisted',
  'adetail.status.SANCTIONED': 'Sanctioned',
  'adetail.status.DISBURSEMENT_PENDING': 'Disbursement Pending',
  'adetail.status.UPLOADED': 'Uploaded',
  'adetail.status.OCR_PROCESSING': 'OCR Processing',
  'adetail.status.DEFICIENT': 'Deficient',
  'adetail.status.REUPLOAD_REQUIRED': 'Re-upload Required',
  'adetail.status.MANUAL_REVIEW': 'Manual Review',
  'adetail.status.REVERIFIED_APPROVED': 'Re-verified & Approved',
  'adetail.status.REJECTED_FINAL': 'Rejected (Final)',
  'adetail.status.NEEDS_HUMAN_REVIEW': 'Needs Human Review',
};
