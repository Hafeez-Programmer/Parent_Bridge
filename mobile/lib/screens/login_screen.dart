import 'package:flutter/material.dart';
import '../navigation/app_router.dart';
import '../theme/app_colors.dart';
import '../theme/app_theme.dart';
import '../theme/app_typography.dart';
import '../widgets/pb_widgets.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController(text: 'fatima.khan@email.com');
  final _passwordController = TextEditingController(text: '••••••••••');

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _handleLogin() {
    if (_formKey.currentState?.validate() ?? false) {
      Navigator.of(context).pushReplacementNamed(AppRoutes.main);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const PbAppBar(title: 'ParentBridge', centerTitle: true),
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(
              horizontal: AppSpacing.lg,
              vertical: AppSpacing.xl,
            ),
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 420),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Center(
                    child: Container(
                      width: 80,
                      height: 80,
                      decoration: BoxDecoration(
                        color: AppColors.lightPrimaryContainer,
                        shape: BoxShape.circle,
                        border: Border.all(color: AppColors.lightPrimary, width: 2),
                      ),
                      alignment: Alignment.center,
                      child: Text(
                        'PB',
                        style: AppTypography.headlineLg(
                          color: AppColors.lightOnPrimaryContainer,
                          tabular: false,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: AppSpacing.sm),
                  Text(
                    'Parent Portal',
                    textAlign: TextAlign.center,
                    style: AppTypography.headlineMd(color: AppColors.lightOnSurface),
                  ),
                  const SizedBox(height: AppSpacing.xs),
                  Text(
                    'Track attendance, exam results, and school notices.',
                    textAlign: TextAlign.center,
                    style: AppTypography.bodyMd(color: AppColors.lightOnSurfaceVariant),
                  ),
                  const SizedBox(height: AppSpacing.lg),
                  PbCard(
                    padding: const EdgeInsets.all(AppSpacing.lg),
                    child: Form(
                      key: _formKey,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          PbInputField(
                            label: 'Email',
                            controller: _emailController,
                            hintText: 'parent@email.com',
                            leadingIcon: Icons.mail_outline,
                            keyboardType: TextInputType.emailAddress,
                            validator: (v) =>
                                (v == null || v.trim().isEmpty) ? 'Enter your email' : null,
                          ),
                          const SizedBox(height: AppSpacing.md),
                          PbInputField(
                            label: 'Password',
                            controller: _passwordController,
                            hintText: 'Enter your password',
                            leadingIcon: Icons.lock_outline,
                            obscureText: true,
                            validator: (v) =>
                                (v == null || v.isEmpty) ? 'Enter your password' : null,
                          ),
                          const SizedBox(height: AppSpacing.md),
                          PbButton(
                            label: 'Login',
                            onPressed: _handleLogin,
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: AppSpacing.lg),
                  TextButton(
                    onPressed: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('Password reset link sent to your email.'),
                        ),
                      );
                    },
                    child: Text(
                      'Forgot password?',
                      style: AppTypography.labelLg(color: AppColors.lightPrimary),
                    ),
                  ),
                  TextButton(
                    onPressed: () => Navigator.of(context).pushNamed(AppRoutes.linkChild),
                    child: RichText(
                      text: TextSpan(
                        style: AppTypography.bodyMd(color: AppColors.lightOnSurfaceVariant),
                        children: [
                          const TextSpan(text: 'First time? '),
                          TextSpan(
                            text: 'Link your child',
                            style: AppTypography.labelLg(color: AppColors.lightSecondary).copyWith(
                              decoration: TextDecoration.underline,
                              decorationColor: AppColors.lightSecondary,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
