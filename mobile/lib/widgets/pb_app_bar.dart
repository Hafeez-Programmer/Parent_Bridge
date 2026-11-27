import 'package:flutter/material.dart';
import '../theme/app_colors.dart';
import '../theme/app_typography.dart';

/// Standardized 56px sticky top app bar matching DESIGN.md.
class PbAppBar extends StatelessWidget implements PreferredSizeWidget {
  const PbAppBar({
    super.key,
    required this.title,
    this.centerTitle = false,
    this.showBackButton = false,
    this.onSettingsPressed,
  });

  final String title;
  final bool centerTitle;
  final bool showBackButton;
  final VoidCallback? onSettingsPressed;

  @override
  Size get preferredSize => const Size.fromHeight(56);

  @override
  Widget build(BuildContext context) {
    return AppBar(
      backgroundColor: AppColors.lightPrimary,
      foregroundColor: AppColors.lightOnPrimary,
      elevation: 0,
      toolbarHeight: 56,
      centerTitle: centerTitle,
      automaticallyImplyLeading: false,
      leading: showBackButton
          ? IconButton(
              icon: const Icon(Icons.arrow_back),
              tooltip: 'Back',
              onPressed: () => Navigator.of(context).maybePop(),
            )
          : null,
      title: Text(
        title,
        style: AppTypography.titleLg(color: AppColors.lightOnPrimary),
      ),
      actions: onSettingsPressed != null
          ? [
              IconButton(
                icon: const Icon(Icons.settings_outlined),
                tooltip: 'Settings',
                onPressed: onSettingsPressed,
              ),
              const SizedBox(width: 4),
            ]
          : null,
    );
  }
}
