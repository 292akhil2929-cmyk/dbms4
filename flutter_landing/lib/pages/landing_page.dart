import 'dart:ui';

import 'package:flutter/material.dart';

import '../sections/featured_grid.dart';
import '../sections/footer_section.dart';
import '../sections/hero_section.dart';
import '../theme/app_theme.dart';
import '../widgets/glass_nav_bar.dart';

class LandingPage extends StatelessWidget {
  const LandingPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        CustomScrollView(
          slivers: const [
            _LuxurySliverAppBar(),
            SliverToBoxAdapter(child: HeroSection()),
            FeaturedGrid(),
            FooterSection(),
            SliverToBoxAdapter(child: SizedBox(height: 24)),
          ],
        ),
      ],
    );
  }
}

class _LuxurySliverAppBar extends StatelessWidget {
  const _LuxurySliverAppBar();

  @override
  Widget build(BuildContext context) {
    return SliverAppBar(
      pinned: true,
      floating: true,
      snap: true,
      backgroundColor: Colors.transparent,
      elevation: 0,
      expandedHeight: 84,
      collapsedHeight: 72,
      flexibleSpace: LayoutBuilder(
        builder: (context, constraints) {
          final t =
              ((constraints.maxHeight - 72) / (84 - 72)).clamp(0.0, 1.0);
          final pad = lerpDouble(18, 12, 1 - t)!;
          final side =
              MediaQuery.sizeOf(context).width >= 900 ? 56.0 : 18.0;

          return Padding(
            padding: EdgeInsets.fromLTRB(side, pad, side, pad),
            child: Align(
              alignment: Alignment.bottomCenter,
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 1220),
                child: const GlassNavBar(),
              ),
            ),
          );
        },
      ),
      bottom: PreferredSize(
        preferredSize: const Size.fromHeight(1),
        child: Container(
          height: 1,
          color: AppTheme.border.withValues(alpha: 0.35),
        ),
      ),
    );
  }
}
