-- Expose only the intelligence tables already protected by row-level security.
-- anon can read only rows permitted by published/verified SELECT policies.
-- authenticated can perform writes only where the existing admin-only RLS policies allow them.
grant select on public.analytics_dataset_versions,
 public.reference_chapter_counts,
 public.prediction_versions,
 public.chapter_predictions,
 public.prediction_model_settings,
 public.exam_papers,
 public.exam_questions,
 public.cee_score_rank_points,
 public.admission_cutoffs,
 public.engineering_institutions,
 public.engineering_branches,
 public.admission_categories,
 public.counselling_rounds,
 public.admission_source_documents
to anon, authenticated;

grant insert, update, delete on public.analytics_dataset_versions,
 public.reference_chapter_counts,
 public.prediction_versions,
 public.chapter_predictions,
 public.prediction_model_settings,
 public.exam_papers,
 public.exam_questions,
 public.cee_score_rank_points,
 public.admission_cutoffs,
 public.engineering_institutions,
 public.engineering_branches,
 public.admission_categories,
 public.counselling_rounds,
 public.admission_source_documents
to authenticated;
