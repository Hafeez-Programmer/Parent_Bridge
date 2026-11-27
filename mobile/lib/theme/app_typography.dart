import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'app_colors.dart';

/// Typography tokens extracted from DESIGN.md for ParentBridge Mobile.
abstract final class AppTypography {
  static TextStyle displayMdMobile({
    Color color = AppColors.lightOnSurface,
    bool tabular = true,
  }) =>
      GoogleFonts.redHatDisplay(
        fontSize: 28,
        fontWeight: FontWeight.w700,
        height: 34 / 28,
        letterSpacing: -0.25,
        color: color,
        fontFeatures: tabular ? const [FontFeature.tabularFigures()] : null,
      );

  static TextStyle headlineLg({
    Color color = AppColors.lightOnSurface,
    bool tabular = true,
  }) =>
      GoogleFonts.redHatDisplay(
        fontSize: 28,
        fontWeight: FontWeight.w700,
        height: 34 / 28,
        letterSpacing: -0.25,
        color: color,
        fontFeatures: tabular ? const [FontFeature.tabularFigures()] : null,
      );

  static TextStyle headlineMd({
    Color color = AppColors.lightOnSurface,
    bool tabular = false,
  }) =>
      GoogleFonts.redHatDisplay(
        fontSize: 22,
        fontWeight: FontWeight.w700,
        height: 28 / 22,
        letterSpacing: 0,
        color: color,
        fontFeatures: tabular ? const [FontFeature.tabularFigures()] : null,
      );

  static TextStyle titleLg({
    Color color = AppColors.lightOnSurface,
  }) =>
      GoogleFonts.redHatDisplay(
        fontSize: 18,
        fontWeight: FontWeight.w600,
        height: 24 / 18,
        letterSpacing: 0,
        color: color,
      );

  static TextStyle titleMd({
    Color color = AppColors.lightOnSurface,
    bool tabular = false,
  }) =>
      GoogleFonts.radioCanadaBig(
        fontSize: 16,
        fontWeight: FontWeight.w600,
        height: 22 / 16,
        letterSpacing: 0,
        color: color,
        fontFeatures: tabular ? const [FontFeature.tabularFigures()] : null,
      );

  static TextStyle bodyLg({
    Color color = AppColors.lightOnSurface,
  }) =>
      GoogleFonts.radioCanadaBig(
        fontSize: 15,
        fontWeight: FontWeight.w400,
        height: 22 / 15,
        letterSpacing: 0,
        color: color,
      );

  static TextStyle bodyMd({
    Color color = AppColors.lightOnSurface,
  }) =>
      GoogleFonts.radioCanadaBig(
        fontSize: 14,
        fontWeight: FontWeight.w400,
        height: 20 / 14,
        letterSpacing: 0,
        color: color,
      );

  static TextStyle labelLg({
    Color color = AppColors.lightOnSurface,
    bool tabular = false,
  }) =>
      GoogleFonts.radioCanadaBig(
        fontSize: 14,
        fontWeight: FontWeight.w600,
        height: 20 / 14,
        letterSpacing: 0,
        color: color,
        fontFeatures: tabular ? const [FontFeature.tabularFigures()] : null,
      );

  static TextStyle labelMd({
    Color color = AppColors.lightOnSurfaceVariant,
    bool tabular = false,
  }) =>
      GoogleFonts.radioCanadaBig(
        fontSize: 13,
        fontWeight: FontWeight.w500,
        height: 18 / 13,
        letterSpacing: 0.1,
        color: color,
        fontFeatures: tabular ? const [FontFeature.tabularFigures()] : null,
      );

  static TextStyle labelSm({
    Color color = AppColors.lightOnSurfaceVariant,
    bool tabular = false,
  }) =>
      GoogleFonts.radioCanadaBig(
        fontSize: 12,
        fontWeight: FontWeight.w500,
        height: 16 / 12,
        letterSpacing: 0.2,
        color: color,
        fontFeatures: tabular ? const [FontFeature.tabularFigures()] : null,
      );

  static TextStyle monoLg({
    Color color = AppColors.lightPrimary,
  }) =>
      GoogleFonts.splineSansMono(
        fontSize: 28,
        fontWeight: FontWeight.w700,
        height: 34 / 28,
        letterSpacing: 1.5,
        color: color,
        fontFeatures: const [FontFeature.tabularFigures()],
      );

  static TextStyle monoMd({
    Color color = AppColors.lightOnSurface,
  }) =>
      GoogleFonts.splineSansMono(
        fontSize: 14,
        fontWeight: FontWeight.w600,
        height: 20 / 14,
        letterSpacing: 0.5,
        color: color,
        fontFeatures: const [FontFeature.tabularFigures()],
      );
}
