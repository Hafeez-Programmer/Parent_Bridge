import 'package:flutter/material.dart';
import '../state/app_state_scope.dart';
import '../theme/app_colors.dart';
import '../theme/app_theme.dart';
import '../theme/app_typography.dart';
import '../widgets/pb_widgets.dart';

class AttendanceScreen extends StatelessWidget {
  const AttendanceScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final state = AppStateScope.of(context);
    final child = state.activeChild;

    if (child == null) {
      return Center(
        child: Text(
          'Link a child to view attendance.',
          style: AppTypography.bodyMd(color: AppColors.lightOnSurfaceVariant),
        ),
      );
    }

    return RefreshIndicator(
      onRefresh: state.refreshDashboard,
      child: ListView(
        padding: const EdgeInsets.all(AppSpacing.md),
        children: [
          // Monthly Attendance Hero Card
          PbCard(
            backgroundColor: AppColors.lightPrimaryContainer,
            padding: const EdgeInsets.all(AppSpacing.lg),
            child: Column(
              children: [
                Text(
                  '${child.attendancePercent}%',
                  style: AppTypography.displayMdMobile(color: AppColors.lightOnPrimaryContainer),
                ),
                const SizedBox(height: AppSpacing.xs),
                Text(
                  'Attendance · ${child.name}',
                  style: AppTypography.bodyMd(color: AppColors.lightOnPrimaryContainer),
                ),
              ],
            ),
          ),
          const SizedBox(height: AppSpacing.md),

          // 3-Column Breakdown
          Row(
            children: [
              Expanded(
                child: _BreakdownTile(
                  count: child.presentCount,
                  label: 'Present',
                  backgroundColor: AppColors.successContainer,
                  textColor: AppColors.onSuccessContainer,
                ),
              ),
              const SizedBox(width: AppSpacing.sm),
              Expanded(
                child: _BreakdownTile(
                  count: child.absentCount,
                  label: 'Absent',
                  backgroundColor: AppColors.lightErrorContainer,
                  textColor: AppColors.lightOnErrorContainer,
                ),
              ),
              const SizedBox(width: AppSpacing.sm),
              Expanded(
                child: _BreakdownTile(
                  count: child.lateCount,
                  label: 'Late',
                  backgroundColor: AppColors.warningContainer,
                  textColor: AppColors.onWarningContainer,
                ),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.md),

          // Recent Days
          Text(
            'Recent days',
            style: AppTypography.titleLg(color: AppColors.lightOnSurface),
          ),
          const SizedBox(height: AppSpacing.sm),
          if (child.recentDays.isEmpty)
            PbCard(
              child: Text(
                'No attendance records yet.',
                style: AppTypography.bodyMd(color: AppColors.lightOnSurfaceVariant),
              ),
            )
          else
            ...child.recentDays.map(
              (day) => Padding(
                padding: const EdgeInsets.only(bottom: AppSpacing.sm),
                child: PbCard(
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        day.dateLabel,
                        style: AppTypography.titleMd(
                          color: AppColors.lightOnSurface,
                          tabular: day.tabular,
                        ),
                      ),
                      PbBadge.attendance(day.status),
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

class _BreakdownTile extends StatelessWidget {
  const _BreakdownTile({
    required this.count,
    required this.label,
    required this.backgroundColor,
    required this.textColor,
  });

  final int count;
  final String label;
  final Color backgroundColor;
  final Color textColor;

  @override
  Widget build(BuildContext context) {
    return PbCard(
      backgroundColor: backgroundColor,
      padding: const EdgeInsets.all(AppSpacing.md),
      child: Column(
        children: [
          Text(
            '$count',
            style: AppTypography.headlineMd(color: textColor, tabular: true),
          ),
          const SizedBox(height: AppSpacing.xs),
          Text(
            label,
            style: AppTypography.labelSm(color: textColor),
          ),
        ],
      ),
    );
  }
}
