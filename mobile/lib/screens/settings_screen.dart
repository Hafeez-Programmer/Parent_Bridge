import 'package:flutter/material.dart';
import '../models/parent_bridge_models.dart';
import '../navigation/app_router.dart';
import '../state/app_state_scope.dart';
import '../theme/app_colors.dart';
import '../theme/app_theme.dart';
import '../theme/app_typography.dart';
import '../widgets/pb_widgets.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final state = AppStateScope.of(context);

    return Scaffold(
      appBar: const PbAppBar(title: 'Settings', showBackButton: true),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.all(AppSpacing.md),
          children: [
            // Parent Identity Card
            PbCard(
              child: Row(
                children: [
                  Container(
                    width: 48,
                    height: 48,
                    decoration: BoxDecoration(
                      color: AppColors.lightPrimaryContainer,
                      shape: BoxShape.circle,
                      border: Border.all(color: AppColors.lightPrimary),
                    ),
                    alignment: Alignment.center,
                    child: Text(
                      'F',
                      style: AppTypography.headlineMd(color: AppColors.lightOnPrimaryContainer),
                    ),
                  ),
                  const SizedBox(width: AppSpacing.md),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          MockParentData.parentName,
                          style: AppTypography.titleMd(color: AppColors.lightOnSurface),
                        ),
                        Text(
                          MockParentData.parentEmail,
                          style: AppTypography.bodyMd(color: AppColors.lightOnSurfaceVariant),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: AppSpacing.lg),

            // Notification Toggles
            _ToggleRow(
              label: 'Announcements alerts',
              value: state.announcementAlerts,
              onChanged: state.setAnnouncementAlerts,
            ),
            const SizedBox(height: AppSpacing.sm),
            _ToggleRow(
              label: 'Absence alerts',
              value: state.absenceAlerts,
              onChanged: state.setAbsenceAlerts,
            ),
            const SizedBox(height: AppSpacing.sm),
            _ToggleRow(
              label: 'Result alerts',
              value: state.resultAlerts,
              onChanged: state.setResultAlerts,
            ),
            const SizedBox(height: AppSpacing.lg),

            // Account Links
            _SettingsActionRow(
              label: 'Change password',
              onTap: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Password change email sent.')),
                );
              },
            ),
            const SizedBox(height: AppSpacing.sm),
            _SettingsActionRow(
              label: 'Privacy policy',
              onTap: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('ParentBridge Privacy Policy v1.0')),
                );
              },
            ),
            const SizedBox(height: AppSpacing.xl),

            // Destructive Logout
            PbButton(
              label: 'Logout',
              variant: PbButtonVariant.destructive,
              onPressed: () {
                Navigator.of(context).pushNamedAndRemoveUntil(
                  AppRoutes.login,
                  (route) => false,
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}

class _ToggleRow extends StatelessWidget {
  const _ToggleRow({
    required this.label,
    required this.value,
    required this.onChanged,
  });

  final String label;
  final bool value;
  final ValueChanged<bool> onChanged;

  @override
  Widget build(BuildContext context) {
    return PbCard(
      padding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.md,
        vertical: AppSpacing.xs,
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: AppTypography.titleMd(color: AppColors.lightOnSurface),
          ),
          Switch(
            value: value,
            onChanged: onChanged,
            activeTrackColor: AppColors.lightSecondary,
            activeThumbColor: AppColors.lightOnSecondary,
          ),
        ],
      ),
    );
  }
}

class _SettingsActionRow extends StatelessWidget {
  const _SettingsActionRow({
    required this.label,
    required this.onTap,
  });

  final String label;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return PbCard(
      onTap: onTap,
      padding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.md,
        vertical: 14,
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: AppTypography.titleMd(color: AppColors.lightOnSurface),
          ),
          const Icon(Icons.chevron_right, color: AppColors.lightOnSurfaceVariant),
        ],
      ),
    );
  }
}
