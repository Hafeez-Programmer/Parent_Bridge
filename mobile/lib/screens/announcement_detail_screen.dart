import 'package:flutter/material.dart';
import '../models/parent_bridge_models.dart';
import '../theme/app_colors.dart';
import '../theme/app_theme.dart';
import '../theme/app_typography.dart';
import '../widgets/pb_widgets.dart';

class AnnouncementDetailScreen extends StatelessWidget {
  const AnnouncementDetailScreen({super.key, required this.announcement});

  final Announcement announcement;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const PbAppBar(title: 'Announcement', showBackButton: true),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.all(AppSpacing.lg),
          children: [
            Text(
              announcement.title,
              style: AppTypography.headlineMd(color: AppColors.lightOnSurface),
            ),
            const SizedBox(height: AppSpacing.sm),
            Wrap(
              spacing: AppSpacing.sm,
              crossAxisAlignment: WrapCrossAlignment.center,
              children: [
                PbBadge(label: announcement.audience, tone: PbBadgeTone.primary),
                Text(
                  announcement.postedAt,
                  style: AppTypography.labelSm(
                    color: AppColors.lightOnSurfaceVariant,
                    tabular: true,
                  ),
                ),
              ],
            ),
            const SizedBox(height: AppSpacing.lg),
            PbCard(
              padding: const EdgeInsets.all(AppSpacing.lg),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  for (var i = 0; i < announcement.paragraphs.length; i++) ...[
                    Text(
                      announcement.paragraphs[i],
                      style: i == 0
                          ? AppTypography.bodyLg(color: AppColors.lightOnSurface)
                          : AppTypography.bodyMd(color: AppColors.lightOnSurfaceVariant),
                    ),
                    if (i < announcement.paragraphs.length - 1)
                      const SizedBox(height: AppSpacing.md),
                  ],
                ],
              ),
            ),
            const SizedBox(height: AppSpacing.lg),
            PbCard(
              backgroundColor: AppColors.lightSurfaceContainerLow,
              padding: const EdgeInsets.symmetric(
                horizontal: AppSpacing.md,
                vertical: AppSpacing.sm + 4,
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Posted by: ${announcement.postedBy}',
                    style: AppTypography.labelMd(color: AppColors.lightOnSurfaceVariant),
                  ),
                  const Icon(
                    Icons.verified_user_outlined,
                    size: 20,
                    color: AppColors.lightOnSurfaceVariant,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
