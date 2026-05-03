import 'package:flutter/material.dart';

import 'pages/landing_page.dart';
import 'theme/app_theme.dart';
import 'ui/smooth_scroll_behavior.dart';

void main() {
  runApp(const LandingApp());
}

class LandingApp extends StatelessWidget {
  const LandingApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      scrollBehavior: const SmoothScrollBehavior(),
      theme: AppTheme.dark(),
      home: const Scaffold(
        body: SafeArea(
          bottom: false,
          child: LandingPage(),
        ),
      ),
    );
  }
}
