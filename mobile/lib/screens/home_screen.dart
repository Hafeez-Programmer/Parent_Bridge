import 'package:flutter/material.dart';
import '../navigation/app_router.dart';
import '../state/app_state_scope.dart';
import '../theme/app_colors.dart';
import '../theme/app_theme.dart';
import '../theme/app_typography.dart';
import '../widgets/pb_widgets.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key, required this.onNavigateTab});

  final ValueChanged<int> onNavigateTab;

  @override
  Widget build(BuildContext context) {
    final state = AppStateScope.of(context);
    final child = state.activeChild;
    final latestAnnouncements = state.announcements.take(2).toList();

    if (state.isLoading && child == null) {
      return const Center(child: CircularProgressIndicator());
    }

    if (child == null) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(AppSpacing.lg),
          child: PbCard(
            padding: const EdgeInsets.all(AppSpacing.lg),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(Icons.child_care, size: 48, color: AppColors.lightPrimary),
                const SizedBox(height: AppSpacing.md),
                Text(
                  'No child linked yet',
                  style: AppTypography.titleLg(color: AppColors.lightOnSurface),
                ),
                const SizedBox(height: AppSpacing.xs),
                Text(
                  'Use the link code and roll number from your school to connect your child.',
                  textAlign: TextAlign.center,
                  style: AppTypography.bodyMd(color: AppColors.lightOnSurfaceVariant),
                ),
                const SizedBox(height: AppSpacing.md),
                PbButton(
                  label: 'Link your child',
                  icon: Icons.person_add,
                  onPressed: () => Navigator.of(context).pushNamed(AppRoutes.linkChild),
                ),
              ],
            ),
          ),
        ),
      );
    }

    return RefreshIndicator(
      onRefresh: state.refreshDashboard,
      child: ListView(
        padding: const EdgeInsets.all(AppSpacing.md),
        children: [
          // Child Switcher Card
          PbCard(
            backgroundColor: AppColors.lightPrimaryContainer,
            onTap: () => Navigator.of(context).pushNamed(AppRoutes.childSelector),
            child: Row(
              children: [
                Container(
                  width: 40,
                  height: 40,
                  decoration: const BoxDecoration(
                    color: AppColors.lightPrimary,
                    shape: BoxShape.circle,
                  ),
                  alignment: Alignment.center,
                  child: Text(
                    child.initial,
                    style: AppTypography.titleMd(color: AppColors.lightOnPrimary),
                  ),
                ),
                const SizedBox(width: AppSpacing.sm),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        '${child.name} · ${child.className}',
                        style: AppTypography.titleMd(color: AppColors.lightOnPrimaryContainer),
                      ),
                      Text(
                        'Roll ${child.rollNumber} · Tap to switch child',
                        style: AppTypography.labelSm(
                          color: AppColors.lightOnPrimaryContainer.withValues(alpha: 0.8),
                          tabular: true,
                        ),
                      ),
                    ],
                  ),
                ),
                const Icon(Icons.swap_horiz, color: AppColors.lightOnPrimaryContainer),
              ],
            ),
          ),
          const SizedBox(height: AppSpacing.md),

          // KPI Metric Row
          IntrinsicHeight(
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Expanded(
                  child: PbCard(
                    backgroundColor: AppColors.successContainer,
                    onTap: () => onNavigateTab(1),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              'Attendance',
                              style: AppTypography.labelMd(color: AppColors.onSuccessContainer),
                            ),
                            const Icon(
                              Icons.event_available,
                              size: 20,
                              color: AppColors.onSuccessContainer,
                            ),
                          ],
                        ),
                        const SizedBox(height: AppSpacing.xs),
                        Text(
                          '${child.attendancePercent}%',
                          style: AppTypography.headlineLg(color: AppColors.onSuccessContainer),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(width: AppSpacing.md),
                Expanded(
                  child: PbCard(
                    backgroundColor: AppColors.warningContainer,
                    onTap: () => onNavigateTab(2),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              'Last result',
                              style: AppTypography.labelMd(color: AppColors.onWarningContainer),
                            ),
                            const Icon(
                              Icons.assessment,
                              size: 20,
                              color: AppColors.onWarningContainer,
                            ),
                          ],
                        ),
                        const SizedBox(height: AppSpacing.xs),
                        Text(
                          child.exams.isEmpty ? '—' : '${child.lastResultPercent}%',
                          style: AppTypography.headlineLg(color: AppColors.onWarningContainer),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: AppSpacing.md),

          // Today's Status Banner
          PbCard(
            padding: const EdgeInsets.symmetric(
              horizontal: AppSpacing.md,
              vertical: AppSpacing.sm + 4,
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    const Icon(Icons.check_circle, color: AppColors.success, size: 22),
                    const SizedBox(width: AppSpacing.sm),
                    Text(
                      "Today's status",
                      style: AppTypography.titleMd(color: AppColors.lightOnSurface),
                    ),
                  ],
                ),
                PbBadge.attendance(child.todayStatus),
              ],
            ),
          ),
          const SizedBox(height: AppSpacing.md),

          // Latest Announcements
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Latest announcements',
                style: AppTypography.titleLg(color: AppColors.lightOnSurface),
              ),
              TextButton(
                onPressed: () => onNavigateTab(3),
                child: Text(
                  'See all',
                  style: AppTypography.labelLg(color: AppColors.lightPrimary),
                ),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.xs),
          if (latestAnnouncements.isEmpty)
            PbCard(
              child: Text(
                'No announcements yet.',
                style: AppTypography.bodyMd(color: AppColors.lightOnSurfaceVariant),
              ),
            )
          else
            ...latestAnnouncements.map(
              (item) => Padding(
                padding: const EdgeInsets.only(bottom: AppSpacing.sm),
                child: PbCard(
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
                ),
              ),
            ),
        ],
      ),
    );
  }
}
