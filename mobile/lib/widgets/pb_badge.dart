import 'package:flutter/material.dart';
import '../models/parent_bridge_models.dart';
import '../theme/app_colors.dart';
import '../theme/app_theme.dart';
import '../theme/app_typography.dart';

enum PbBadgeTone { success, warning, error, primary, secondary }

class PbBadge extends StatelessWidget {
  const PbBadge({
    super.key,
    required this.label,
    this.tone = PbBadgeTone.primary,
  });

  factory PbBadge.attendance(AttendanceStatus status) {
    switch (status) {
      case AttendanceStatus.present:
        return const PbBadge(label: 'Present', tone: PbBadgeTone.success);
      case AttendanceStatus.absent:
        return const PbBadge(label: 'Absent', tone: PbBadgeTone.error);
      case AttendanceStatus.late:
        return const PbBadge(label: 'Late', tone: PbBadgeTone.warning);
    }
  }

  final String label;
  final PbBadgeTone tone;

  @override
  Widget build(BuildContext context) {
    final (bg, fg) = switch (tone) {
      PbBadgeTone.success => (AppColors.successContainer, AppColors.onSuccessContainer),
      PbBadgeTone.warning => (AppColors.warningContainer, AppColors.onWarningContainer),
      PbBadgeTone.error => (AppColors.lightErrorContainer, AppColors.lightOnErrorContainer),
      PbBadgeTone.primary => (AppColors.lightPrimaryContainer, AppColors.lightOnPrimaryContainer),
      PbBadgeTone.secondary => (
          AppColors.lightSecondaryContainer,
          AppColors.lightOnSecondaryContainer
        ),
    };

    return Semantics(
      label: label,
      child: Container(
        padding: const EdgeInsets.symmetric(
          horizontal: AppSpacing.sm + 2,
          vertical: AppSpacing.xs,
        ),
        decoration: BoxDecoration(
          color: bg,
          borderRadius: BorderRadius.circular(AppRadii.full),
        ),
        child: Text(
          label,
          style: AppTypography.labelSm(color: fg),
        ),
      ),
    );
  }
}

class PbUnreadDot extends StatelessWidget {
  const PbUnreadDot({super.key, required this.unread});

  final bool unread;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 10,
      height: 10,
      decoration: BoxDecoration(
        color: unread ? AppColors.lightSecondary : AppColors.lightOutlineVariant,
        shape: BoxShape.circle,
      ),
    );
  }
}
