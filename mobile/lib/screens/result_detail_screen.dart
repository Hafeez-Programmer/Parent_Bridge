import 'package:flutter/material.dart';
import '../models/parent_bridge_models.dart';
import '../theme/app_colors.dart';
import '../theme/app_theme.dart';
import '../theme/app_typography.dart';
import '../widgets/pb_widgets.dart';

class ResultDetailScreen extends StatelessWidget {
  const ResultDetailScreen({super.key, required this.exam});

  final ExamResult exam;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: PbAppBar(title: exam.title, showBackButton: true),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.all(AppSpacing.md),
          children: [
            // Total Score Summary
            PbCard(
              backgroundColor: AppColors.lightPrimaryContainer,
              padding: const EdgeInsets.all(AppSpacing.lg),
              child: Column(
                children: [
                  Text(
                    'Total ${exam.totalObtained} / ${exam.totalMax}',
                    style: AppTypography.headlineMd(
                      color: AppColors.lightOnPrimaryContainer,
                      tabular: true,
                    ),
                  ),
                  const SizedBox(height: AppSpacing.xs),
                  Text(
                    '${exam.percentage.toStringAsFixed(1)}% · Grade ${exam.grade}',
                    style: AppTypography.titleMd(
                      color: AppColors.lightOnPrimaryContainer,
                      tabular: true,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: AppSpacing.lg),

            // Subject Bar Chart
            PbCard(
              padding: const EdgeInsets.all(AppSpacing.md),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Subject breakdown',
                    style: AppTypography.titleLg(color: AppColors.lightOnSurface),
                  ),
                  const SizedBox(height: AppSpacing.md),
                  ...exam.subjects.map(
                    (subj) => Padding(
                      padding: const EdgeInsets.only(bottom: AppSpacing.md),
                      child: Row(
                        children: [
                          SizedBox(
                            width: 56,
                            child: Text(
                              subj.shortName,
                              style: AppTypography.labelMd(color: AppColors.lightOnSurface),
                            ),
                          ),
                          const SizedBox(width: AppSpacing.sm),
                          Expanded(
                            child: Container(
                              height: 20,
                              decoration: BoxDecoration(
                                color: AppColors.lightSurfaceContainerLow,
                                borderRadius: BorderRadius.circular(AppRadii.sm),
                              ),
                              alignment: Alignment.centerLeft,
                              child: FractionallySizedBox(
                                widthFactor: subj.ratio.clamp(0.0, 1.0),
                                child: Container(
                                  decoration: BoxDecoration(
                                    color: AppColors.lightSecondary,
                                    borderRadius: BorderRadius.circular(AppRadii.sm),
                                  ),
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(width: AppSpacing.sm),
                          SizedBox(
                            width: 36,
                            child: Text(
                              '${subj.obtained}',
                              textAlign: TextAlign.right,
                              style: AppTypography.labelLg(
                                color: AppColors.lightOnSurface,
                                tabular: true,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: AppSpacing.lg),

            // Action Buttons
            Row(
              children: [
                Expanded(
                  child: PbButton(
                    label: 'Download',
                    icon: Icons.download,
                    variant: PbButtonVariant.primary,
                    onPressed: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Report card PDF downloaded.')),
                      );
                    },
                  ),
                ),
                const SizedBox(width: AppSpacing.md),
                Expanded(
                  child: PbButton(
                    label: 'Share',
                    icon: Icons.share,
                    variant: PbButtonVariant.secondary,
                    onPressed: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Opening share sheet...')),
                      );
                    },
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
