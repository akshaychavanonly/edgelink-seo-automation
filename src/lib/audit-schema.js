const { z } = require("zod");

const score = z.number().int().min(0).max(100);

const recommendation = z.object({
  priority: z.enum(["CRITICAL", "HIGH", "MEDIUM", "LOW"]),
  category: z.enum(["Technical", "OnPage", "Content", "Schema", "CWV"]),
  finding: z.string().min(1),
  fix: z.string().min(1),
  estimated_impact: z.enum(["High", "Medium", "Low"]),
  effort: z.enum(["Hours", "Days", "Weeks"]),
  falsifiability_check: z.string().min(1),
});

const auditSchema = z.object({
  audit_version: z.literal("v1.0"),
  overall_score: score,
  score_breakdown: z.object({
    technical: score,
    on_page: score,
    content: score,
    core_web_vitals: score,
    schema: score,
  }),
  critical_issues: z.array(z.string()).max(5),
  important_issues: z.array(z.string()).max(8),
  quick_wins: z.array(z.string()).max(5),
  recommendations: z.array(recommendation),
  executive_summary: z.string().min(1),
});

module.exports = { auditSchema };
