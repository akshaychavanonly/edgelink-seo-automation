module.exports = {
  audit_version: "v1.0",
  overall_score: 68,
  score_breakdown: {
    technical: 75,
    on_page: 70,
    content: 65,
    core_web_vitals: 61,
    schema: 69,
  },
  critical_issues: [
    "Largest Contentful Paint is 4.2 seconds",
    "Unused JavaScript totals 420 KiB",
  ],
  important_issues: [
    "Three index coverage errors reported",
    "Mobile performance score is 61/100",
  ],
  quick_wins: [
    "Review render-blocking resources",
    "Check image alternative text",
  ],
  recommendations: [
    {
      priority: "CRITICAL",
      category: "CWV",
      finding: "Largest Contentful Paint is 4.2 seconds.",
      fix: "Optimize the main image and reduce render-blocking resources.",
      estimated_impact: "High",
      effort: "Days",
      falsifiability_check:
        "Rerun PageSpeed Insights and compare the LCP value.",
    },
    {
      priority: "HIGH",
      category: "Technical",
      finding: "Three index coverage errors were reported.",
      fix: "Investigate the affected URLs in Google Search Console.",
      estimated_impact: "High",
      effort: "Hours",
      falsifiability_check:
        "Confirm the reported indexing errors have been resolved.",
    },
  ],
  executive_summary:
    "The sample dental website has opportunities to improve mobile performance and indexing. Prioritize Core Web Vitals and investigate index coverage errors.",
};
