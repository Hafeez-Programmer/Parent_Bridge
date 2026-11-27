import 'package:flutter/material.dart';
import '../theme/app_colors.dart';
import '../theme/app_theme.dart';
import '../theme/app_typography.dart';

class PbInputField extends StatelessWidget {
  const PbInputField({
    super.key,
    required this.label,
    required this.controller,
    this.hintText,
    this.helperText,
    this.leadingIcon,
    this.obscureText = false,
    this.keyboardType,
    this.textCapitalization = TextCapitalization.none,
    this.mono = false,
    this.validator,
  });

  final String label;
  final TextEditingController controller;
  final String? hintText;
  final String? helperText;
  final IconData? leadingIcon;
  final bool obscureText;
  final TextInputType? keyboardType;
  final TextCapitalization textCapitalization;
  final bool mono;
  final String? Function(String?)? validator;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: AppTypography.labelMd(color: AppColors.lightOnSurfaceVariant),
        ),
        const SizedBox(height: AppSpacing.xs),
        TextFormField(
          controller: controller,
          obscureText: obscureText,
          keyboardType: keyboardType,
          textCapitalization: textCapitalization,
          validator: validator,
          style: mono
              ? AppTypography.monoMd(color: AppColors.lightOnSurface)
              : AppTypography.bodyMd(color: AppColors.lightOnSurface),
          decoration: InputDecoration(
            hintText: hintText,
            hintStyle: AppTypography.bodyMd(color: AppColors.lightOutline),
            helperText: helperText,
            helperStyle: AppTypography.labelSm(color: AppColors.lightOnSurfaceVariant),
            filled: true,
            fillColor: AppColors.lightSurface,
            prefixIcon: leadingIcon != null
                ? Icon(leadingIcon, size: 20, color: AppColors.lightOutline)
                : null,
            contentPadding: const EdgeInsets.symmetric(
              horizontal: AppSpacing.md,
              vertical: 14,
            ),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppRadii.base),
              borderSide: const BorderSide(color: AppColors.lightOutlineVariant),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppRadii.base),
              borderSide: const BorderSide(color: AppColors.lightOutlineVariant),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppRadii.base),
              borderSide: const BorderSide(color: AppColors.lightPrimary, width: 1.5),
            ),
          ),
        ),
      ],
    );
  }
}
