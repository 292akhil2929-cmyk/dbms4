import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppTheme {
  static const Color bg = Color(0xFF07070B);
  static const Color surface = Color(0xFF0F0F16);
  static const Color surface2 = Color(0xFF13131D);
  static const Color border = Color(0xFF2A2A3A);
  static const Color text = Color(0xFFF6F6FB);
  static const Color muted = Color(0xFF9B9BB7);
  static const Color accentBlue = Color(0xFF3B82F6);

  static ThemeData dark() {
    final base = ThemeData.dark(useMaterial3: true);
    return base.copyWith(
      scaffoldBackgroundColor: bg,
      colorScheme: base.colorScheme.copyWith(
        primary: accentBlue,
        surface: surface,
      ),
      textTheme: GoogleFonts.interTextTheme(base.textTheme).apply(
        bodyColor: text,
        displayColor: text,
      ),
    );
  }
}
