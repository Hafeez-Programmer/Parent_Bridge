import 'package:flutter/material.dart';

/// Color tokens extracted from DESIGN.md for ParentBridge Mobile.
abstract final class AppColors {
  // Semantic & Status Colors
  static const Color success = Color(0xFF15803D);
  static const Color onSuccess = Color(0xFFFFFFFF);
  static const Color successContainer = Color(0xFFDCFCE7);
  static const Color onSuccessContainer = Color(0xFF14532D);

  static const Color warning = Color(0xFFB45309);
  static const Color onWarning = Color(0xFFFFFFFF);
  static const Color warningContainer = Color(0xFFFEF3C7);
  static const Color onWarningContainer = Color(0xFF78350F);

  static const Color lavenderContainer = Color(0xFFF3E8FF);
  static const Color onLavenderContainer = Color(0xFF4C1D95);

  // Light Theme Tokens
  static const Color lightPrimary = Color(0xFF1D4ED8);
  static const Color lightOnPrimary = Color(0xFFFFFFFF);
  static const Color lightPrimaryContainer = Color(0xFFDBEAFE);
  static const Color lightOnPrimaryContainer = Color(0xFF1E3A8A);

  static const Color lightSecondary = Color(0xFF006A61);
  static const Color lightOnSecondary = Color(0xFFFFFFFF);
  static const Color lightSecondaryContainer = Color(0xFFCCFBF1);
  static const Color lightOnSecondaryContainer = Color(0xFF115E59);

  static const Color lightTertiary = Color(0xFF904D00);
  static const Color lightOnTertiary = Color(0xFFFFFFFF);
  static const Color lightTertiaryContainer = Color(0xFFFFEDE3);
  static const Color lightOnTertiaryContainer = Color(0xFF4D2600);

  static const Color lightError = Color(0xFFBA1A1A);
  static const Color lightOnError = Color(0xFFFFFFFF);
  static const Color lightErrorContainer = Color(0xFFFFDAD6);
  static const Color lightOnErrorContainer = Color(0xFF93000A);

  static const Color lightBackground = Color(0xFFF8FAFF);
  static const Color lightOnBackground = Color(0xFF0B1C30);
  static const Color lightSurface = Color(0xFFFFFFFF);
  static const Color lightSurfaceDim = Color(0xFFE2E8F0);
  static const Color lightSurfaceContainerLow = Color(0xFFEFF4FF);
  static const Color lightSurfaceContainer = Color(0xFFE5EEFF);
  static const Color lightSurfaceContainerHigh = Color(0xFFDCE9FF);
  static const Color lightSurfaceContainerHighest = Color(0xFFD3E4FE);
  static const Color lightOnSurface = Color(0xFF0B1C30);
  static const Color lightSurfaceVariant = Color(0xFFE0E1F4);
  static const Color lightOnSurfaceVariant = Color(0xFF434655);

  static const Color lightOutline = Color(0xFF747686);
  static const Color lightOutlineVariant = Color(0xFFCBD5E1);
  static const Color lightInverseSurface = Color(0xFF213145);
  static const Color lightInverseOnSurface = Color(0xFFEAF1FF);
  static const Color lightInversePrimary = Color(0xFFB7C4FF);

  // Dark Theme Tokens
  static const Color darkPrimary = Color(0xFFB7C4FF);
  static const Color darkOnPrimary = Color(0xFF002682);
  static const Color darkPrimaryContainer = Color(0xFF1D4ED8);
  static const Color darkOnPrimaryContainer = Color(0xFFFFFFFF);

  static const Color darkSecondary = Color(0xFF6BD8CB);
  static const Color darkOnSecondary = Color(0xFF003732);
  static const Color darkSecondaryContainer = Color(0xFF006A61);
  static const Color darkOnSecondaryContainer = Color(0xFFFFFFFF);

  static const Color darkError = Color(0xFFFFB4AB);
  static const Color darkOnError = Color(0xFF690005);
  static const Color darkErrorContainer = Color(0xFF93000A);
  static const Color darkOnErrorContainer = Color(0xFFFFDAD6);

  static const Color darkBackground = Color(0xFF031427);
  static const Color darkOnBackground = Color(0xFFD3E4FE);
  static const Color darkSurface = Color(0xFF0B1C30);
  static const Color darkOnSurface = Color(0xFFD3E4FE);
  static const Color darkOnSurfaceVariant = Color(0xFFC4C5D7);
  static const Color darkOutlineVariant = Color(0xFF334155);
}
