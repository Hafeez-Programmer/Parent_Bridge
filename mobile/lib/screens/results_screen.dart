import 'package:flutter/material.dart';
import '../navigation/app_router.dart';
import '../state/app_state_scope.dart';
import '../theme/app_colors.dart';
import '../theme/app_theme.dart';
import '../theme/app_typography.dart';
import '../widgets/pb_widgets.dart';

class ResultsScreen extends StatefulWidget {
  const ResultsScreen({super.key});

  @override
  State<ResultsScreen> createState() => _ResultsScreenState();
}

class _ResultsScreenState extends State<ResultsScreen> {
  String _selectedTerm = 'Mid-Term';
  String _selectedSubject = 'All subjects';

  @override
  Widget build(BuildContext context) {
    final child = AppStateScope.of(context).activeChild;
    final exam = child.exams.firstWhere(
      (e) => e.term == _selectedTerm,
      orElse: () => child.exams.first,
    );

    final subjects = _selectedSubject == 'All subjects'
        ? exam.subjects
        : exam.subjects.where((s) => s.subject == _selectedSubject).toList();

    return ListView(
      padding: const EdgeInsets.all(AppSpacing.md),
      children: [
        // Filter Row
        Row(
          children: [
            Expanded(
              child: _FilterDropdown(
                value: _selectedTerm,
                items: child.exams.map((e) => e.term).toList(),
                onChanged: (val) {
                  if (val != null) setState(() => _selectedTerm = val);
                },
              ),
            ),
            const SizedBox(width: AppSpacing.sm),
            Expanded(
              child: _FilterDropdown(
                value: _selectedSubject,
                items: ['All subjects', ...exam.subjects.map((s) => s.subject)],
                onChanged: (val) {
                  if (val != null) setState(() => _selectedSubject = val);
                },
              ),
            ),
          ],
        ),
        const SizedBox(height: AppSpacing.md),

        // Subject List
        ...subjects.map(
          (subj) => Padding(
            padding: const EdgeInsets.only(bottom: AppSpacing.sm),
            child: PbCard(
              onTap: () => Navigator.of(context).pushNamed(
                AppRoutes.resultDetail,
                arguments: exam,
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    subj.subject,
                    style: AppTypography.titleMd(color: AppColors.lightOnSurface),
                  ),
                  Text(
                    '${subj.obtained}/${subj.total}',
                    style: AppTypography.labelLg(
                      color: AppColors.lightOnSurface,
                      tabular: true,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
        const SizedBox(height: AppSpacing.sm),

        // Total Summary Card
        PbCard(
          backgroundColor: AppColors.lightPrimaryContainer,
          onTap: () => Navigator.of(context).pushNamed(
            AppRoutes.resultDetail,
            arguments: exam,
          ),
          child: Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Total ${exam.totalObtained}/${exam.totalMax} · Grade ${exam.grade}',
                      style: AppTypography.titleMd(
                        color: AppColors.lightOnPrimaryContainer,
                        tabular: true,
                      ),
                    ),
                    const SizedBox(height: AppSpacing.xs),
                    Text(
                      'Tap for breakdown & report',
                      style: AppTypography.labelSm(
                        color: AppColors.lightOnPrimaryContainer.withValues(alpha: 0.8),
                      ),
                    ),
                  ],
                ),
              ),
              const Icon(Icons.chevron_right, color: AppColors.lightOnPrimaryContainer),
            ],
          ),
        ),
      ],
    );
  }
}

class _FilterDropdown extends StatelessWidget {
  const _FilterDropdown({
    required this.value,
    required this.items,
    required this.onChanged,
  });

  final String value;
  final List<String> items;
  final ValueChanged<String?> onChanged;

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 44,
      padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md),
      decoration: BoxDecoration(
        color: AppColors.lightSurface,
        borderRadius: BorderRadius.circular(AppRadii.base),
        border: Border.all(color: AppColors.lightOutlineVariant),
      ),
      child: DropdownButtonHideUnderline(
        child: DropdownButton<String>(
          value: items.contains(value) ? value : items.first,
          isExpanded: true,
          style: AppTypography.labelMd(color: AppColors.lightOnSurface),
          items: items
              .map((item) => DropdownMenuItem(value: item, child: Text(item)))
              .toList(),
          onChanged: onChanged,
        ),
      ),
    );
  }
}
