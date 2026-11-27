import 'package:flutter/material.dart';
import '../theme/app_colors.dart';
import '../theme/app_theme.dart';
import '../theme/app_typography.dart';

enum PbButtonVariant { primary, secondary, destructive }

class PbButton extends StatelessWidget {
  const PbButton({
    super.key,
    required this.label,
    required this.onPressed,
    this.variant = PbButtonVariant.primary,
    this.icon,
    this.fullWidth = true,
  });

  final String label;
  final VoidCallback? onPressed;
  final PbButtonVariant variant;
  final IconData? icon;
  final bool fullWidth;

  @override
  Widget build(BuildContext context) {
    final (bg, fg, borderSide) = switch (variant) {
      PbButtonVariant.primary => (
          AppColors.lightSecondary,
          AppColors.lightOnSecondary,
          BorderSide.none,
        ),
      PbButtonVariant.secondary => (
          AppColors.lightPrimaryContainer,
          AppColors.lightOnPrimaryContainer,
          const BorderSide(color: AppColors.lightOutlineVariant),
        ),
      PbButtonVariant.destructive => (
          AppColors.lightErrorContainer,
          AppColors.lightOnErrorContainer,
          BorderSide.none,
        ),
    };

    final child = Row(
      mainAxisSize: MainAxisSize.min,
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        if (icon != null) ...[
          Icon(icon, size: 20, color: fg),
          const SizedBox(width: AppSpacing.sm),
        ],
        Text(label, style: AppTypography.labelLg(color: fg)),
      ],
    );

    return SizedBox(
      width: fullWidth ? double.infinity : null,
      height: 48,
      child: ElevatedButton(
        onPressed: onPressed,
        style: ElevatedButton.styleFrom(
          backgroundColor: bg,
          foregroundColor: fg,
          elevation: 0,
          shadowColor: Colors.transparent,
          padding: const EdgeInsets.symmetric(
            horizontal: AppSpacing.lg,
            vertical: AppSpacing.sm,
          ),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(AppRadii.base),
            side: borderSide,
          ),
        ),
        child: child,
      ),
    );
  }
}
