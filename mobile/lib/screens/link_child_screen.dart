import 'package:flutter/material.dart';
import '../navigation/app_router.dart';
import '../state/app_state_scope.dart';
import '../theme/app_colors.dart';
import '../theme/app_theme.dart';
import '../theme/app_typography.dart';
import '../widgets/pb_widgets.dart';

class LinkChildScreen extends StatefulWidget {
  const LinkChildScreen({super.key});

  @override
  State<LinkChildScreen> createState() => _LinkChildScreenState();
}

class _LinkChildScreenState extends State<LinkChildScreen> {
  final _formKey = GlobalKey<FormState>();
  final _linkCodeController = TextEditingController();
  final _rollController = TextEditingController();

  @override
  void dispose() {
    _linkCodeController.dispose();
    _rollController.dispose();
    super.dispose();
  }

  Future<void> _handleLinkChild() async {
    if (!(_formKey.currentState?.validate() ?? false)) return;

    final state = AppStateScope.of(context);
    final ok = await state.linkChild(
      linkCode: _linkCodeController.text,
      rollNumber: _rollController.text,
    );

    if (!mounted || !ok) return;

    Navigator.of(context).pushNamedAndRemoveUntil(
      AppRoutes.main,
      (route) => false,
    );
  }

  @override
  Widget build(BuildContext context) {
    final state = AppStateScope.of(context);

    return Scaffold(
      appBar: const PbAppBar(title: 'Link Your Child', showBackButton: true),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(AppSpacing.lg),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Text(
                "Enter the code given by the school to connect your child's profile.",
                style: AppTypography.bodyMd(color: AppColors.lightOnSurfaceVariant),
              ),
              const SizedBox(height: AppSpacing.lg),
              if (state.errorMessage != null) ...[
                PbCard(
                  backgroundColor: AppColors.lightErrorContainer,
                  borderColor: AppColors.lightError,
                  padding: const EdgeInsets.all(AppSpacing.md),
                  child: Text(
                    state.errorMessage!,
                    style: AppTypography.bodyMd(color: AppColors.lightOnErrorContainer),
                  ),
                ),
                const SizedBox(height: AppSpacing.md),
              ],
              PbCard(
                padding: const EdgeInsets.all(AppSpacing.lg),
                child: Form(
                  key: _formKey,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      PbInputField(
                        label: 'Link code',
                        controller: _linkCodeController,
                        hintText: 'e.g. K7P2M9QX',
                        helperText: '8-character school link code',
                        textCapitalization: TextCapitalization.characters,
                        mono: true,
                        validator: (v) =>
                            (v == null || v.trim().length < 4) ? 'Enter a valid link code' : null,
                      ),
                      const SizedBox(height: AppSpacing.md),
                      PbInputField(
                        label: "Child's roll number",
                        controller: _rollController,
                        hintText: 'e.g. 01',
                        helperText: 'Roll number assigned by the school',
                        keyboardType: TextInputType.text,
                        mono: true,
                        validator: (v) =>
                            (v == null || v.trim().isEmpty) ? 'Enter roll number' : null,
                      ),
                      const SizedBox(height: AppSpacing.md),
                      PbButton(
                        label: state.isLoading ? 'Linking...' : 'Link Child',
                        onPressed: state.isLoading ? null : _handleLinkChild,
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: AppSpacing.lg),
              PbCard(
                backgroundColor: AppColors.warningContainer,
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Icon(Icons.help_outline, color: AppColors.onWarningContainer),
                    const SizedBox(width: AppSpacing.sm),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Code not working?',
                            style: AppTypography.labelLg(color: AppColors.onWarningContainer),
                          ),
                          const SizedBox(height: AppSpacing.xs),
                          Text(
                            'Contact the school office to request a new parent link code.',
                            style: AppTypography.bodyMd(color: AppColors.onWarningContainer),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
