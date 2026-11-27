import 'package:flutter/material.dart';
import '../navigation/app_router.dart';
import '../state/app_state_scope.dart';
import '../theme/app_colors.dart';
import '../theme/app_theme.dart';
import '../theme/app_typography.dart';
import '../widgets/pb_widgets.dart';

class ChildSelectorScreen extends StatelessWidget {
  const ChildSelectorScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final state = AppStateScope.of(context);
    final children = state.children;

    return Scaffold(
      appBar: const PbAppBar(title: 'My Children', showBackButton: true),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.all(AppSpacing.md),
          children: [
            ...List.generate(children.length, (index) {
              final child = children[index];
              final isSelected = index == state.selectedChildIndex;

              return Padding(
                padding: const EdgeInsets.only(bottom: AppSpacing.sm),
                child: PbCard(
                  backgroundColor:
                      isSelected ? AppColors.lightPrimaryContainer : AppColors.lightSurface,
                  borderColor:
                      isSelected ? AppColors.lightPrimary : AppColors.lightOutlineVariant,
                  borderWidth: isSelected ? 2 : 1,
                  onTap: () {
                    state.selectChild(index);
                    Navigator.of(context).pop();
                  },
                  child: Row(
                    children: [
                      Container(
                        width: 48,
                        height: 48,
                        decoration: BoxDecoration(
                          color: isSelected
                              ? AppColors.lightPrimary
                              : AppColors.lightSecondaryContainer,
                          shape: BoxShape.circle,
                          border: isSelected
                              ? null
                              : Border.all(color: AppColors.lightOutlineVariant),
                        ),
                        alignment: Alignment.center,
                        child: Text(
                          child.initial,
                          style: AppTypography.headlineMd(
                            color: isSelected
                                ? AppColors.lightOnPrimary
                                : AppColors.lightOnSecondaryContainer,
                          ),
                        ),
                      ),
                      const SizedBox(width: AppSpacing.md),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              child.name,
                              style: AppTypography.titleMd(
                                color: isSelected
                                    ? AppColors.lightOnPrimaryContainer
                                    : AppColors.lightOnSurface,
                              ),
                            ),
                            const SizedBox(height: AppSpacing.xs),
                            Text(
                              '${child.className} · Roll ${child.rollNumber}',
                              style: AppTypography.labelMd(
                                color: isSelected
                                    ? AppColors.lightOnPrimaryContainer.withValues(alpha: 0.8)
                                    : AppColors.lightOnSurfaceVariant,
                                tabular: true,
                              ),
                            ),
                          ],
                        ),
                      ),
                      Icon(
                        isSelected ? Icons.check_circle : Icons.chevron_right,
                        color: isSelected
                            ? AppColors.lightPrimary
                            : AppColors.lightOnSurfaceVariant,
                      ),
                    ],
                  ),
                ),
              );
            }),
            const SizedBox(height: AppSpacing.sm),
            PbButton(
              label: 'Link another child',
              icon: Icons.person_add,
              variant: PbButtonVariant.secondary,
              onPressed: () => Navigator.of(context).pushNamed(AppRoutes.linkChild),
            ),
          ],
        ),
      ),
    );
  }
}
