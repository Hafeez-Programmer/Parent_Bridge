import 'package:flutter/material.dart';
import '../navigation/app_router.dart';
import '../state/app_state_scope.dart';
import '../theme/app_colors.dart';
import '../theme/app_theme.dart';
import '../theme/app_typography.dart';
import '../widgets/pb_widgets.dart';

class AnnouncementsScreen extends StatelessWidget {
  const AnnouncementsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final state = AppStateScope.of(context);
    final announcements = state.announcements;

    return ListView.separated(
      padding: const EdgeInsets.all(AppSpacing.md),
      itemCount: announcements.length,
      separatorBuilder: (_, _) => const SizedBox(height: AppSpacing.sm),
      itemBuilder: (context, index) {
        final item = announcements[index];
        return PbCard(
          onTap: () {
            state.markAnnouncementRead(item.id);
            Navigator.of(context).pushNamed(
              AppRoutes.announcementDetail,
              arguments: item,
            );
          },
          child: Row(
            children: [
              PbUnreadDot(unread: item.unread),
              const SizedBox(width: AppSpacing.sm),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      item.title,
                      style: AppTypography.titleMd(color: AppColors.lightOnSurface),
                    ),
                    const SizedBox(height: AppSpacing.xs),
                    Text(
                      '${item.audience} · ${item.timeLabel}',
                      style: AppTypography.labelSm(color: AppColors.lightOnSurfaceVariant),
                    ),
                  ],
                ),
              ),
              const Icon(Icons.chevron_right, color: AppColors.lightOnSurfaceVariant),
            ],
          ),
        );
      },
    );
  }
}
